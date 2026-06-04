import { useState } from "react";
import { Badge, Button, Form, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useCreateNotification,
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUpdateNotification,
} from "./useNotification";
import type { Notification } from "@/types/notification";
import HasPermission from "@/components/HasPermission";

const { Title, Text } = Typography;
const { TextArea } = Input;

type ModalMode = "create" | "edit";

const NotificationPage = () => {
  const { notifications, isLoading, unreadCount } = useNotifications();
  const createNotification = useCreateNotification();
  const updateNotification = useUpdateNotification();
  const deleteNotification = useDeleteNotification();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  /* ── Filtered data ── */
  const filtered = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  /* ── Open create modal ── */
  const openCreate = () => {
    setModalMode("create");
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  /* ── Open edit modal ── */
  const openEdit = (record: Notification) => {
    setModalMode("edit");
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description ?? "",
      link: record.link ?? "",
    });
    setIsModalOpen(true);
  };

  /* ── Submit modal ── */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        title: values.title,
        description: values.description || undefined,
        link: values.link || undefined,
      };

      if (modalMode === "create") {
        await createNotification.mutateAsync(payload);
      } else if (editingId) {
        await updateNotification.mutateAsync({ id: editingId, data: payload });
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch {
      // antd form handles inline errors
    }
  };

  const isPending = createNotification.isPending || updateNotification.isPending;

  /* ── Table columns ── */
  const columns: ColumnsType<Notification> = [
    {
      title: "Trạng thái",
      dataIndex: "isRead",
      width: 120,
      align: "center",
      filters: [
        { text: "Chưa đọc", value: false },
        { text: "Đã đọc", value: true },
      ],
      onFilter: (value, record) => record.isRead === value,
      render: (isRead: boolean) =>
        isRead ? (
          <Tag color="default" icon={<CheckCircleOutlined />}>
            Đã đọc
          </Tag>
        ) : (
          <Badge dot>
            <Tag color="blue" icon={<BellOutlined />}>
              Chưa đọc
            </Tag>
          </Badge>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      ellipsis: true,
      render: (text: string, record) => (
        <Text strong={!record.isRead} style={{ color: record.isRead ? "#595959" : "#1677ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      ellipsis: true,
      render: (text?: string | null) => <Text type="secondary">{text || "—"}</Text>,
    },
    {
      title: "Liên kết",
      dataIndex: "link",
      width: 160,
      ellipsis: true,
      render: (link?: string | null) =>
        link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
            {link}
          </a>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 150,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend",
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {dayjs(date).format("DD/MM/YYYY HH:mm")}
        </Text>
      ),
    },
    {
      title: "Hành động",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size={4}>
          {/* Edit */}
          <HasPermission requiredPermissions={["notification.manage"]}>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEdit(record)}
                style={{ color: "#faad14" }}
              />
            </Tooltip>
          </HasPermission>

          {/* Mark read */}
          {!record.isRead && (
            <Tooltip title="Đánh dấu đã đọc">
              <Button
                type="text"
                size="small"
                icon={<ReadOutlined />}
                loading={markRead.isPending}
                onClick={() => markRead.mutate(record.id)}
                style={{ color: "#1677ff" }}
              />
            </Tooltip>
          )}

          {/* Delete */}
          <HasPermission requiredPermissions={["notification.manage"]}>
            <Popconfirm
              title="Xóa thông báo?"
              description="Bạn có chắc muốn xóa thông báo này không?"
              onConfirm={() => deleteNotification.mutate(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleteNotification.isPending}
                />
              </Tooltip>
            </Popconfirm>
          </HasPermission>
        </Space>
      ),
    },
  ];

  /* ── Render ── */
  return (
    <div className="min-h-[calc(100vh-64px)] py-8 px-6" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto">
        {/* ── Page header ── */}
        <div
          className="flex items-center justify-between mb-4 pb-4 flex-wrap gap-3"
          style={{ borderBottom: "1px solid #f0f0f0" }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#1677ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BellOutlined style={{ fontSize: 22, color: "#fff" }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Quản lý Thông báo
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                {unreadCount > 0 ? (
                  <span>
                    <Badge count={unreadCount} size="small" style={{ marginRight: 6 }} />
                    thông báo chưa đọc
                  </span>
                ) : (
                  "Tất cả đã đọc"
                )}
              </Text>
            </div>
          </div>

          <Space wrap>
            {unreadCount > 0 && (
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => markAllRead.mutate()}
                loading={markAllRead.isPending}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            )}
            <HasPermission requiredPermissions={["notification.manage"]}>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{ borderRadius: 8 }}>
                Tạo thông báo
              </Button>
            </HasPermission>
          </Space>
        </div>

        {/* ── Search bar ── */}
        <Input
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          size="large"
          style={{ borderRadius: 10, marginBottom: 16 }}
        />

        {/* ── Table ── */}
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            overflow: "hidden",
          }}
        >
          <Table<Notification>
            columns={columns}
            dataSource={filtered}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              position: ["bottomCenter"],
            }}
            rowClassName={(record) => (!record.isRead ? "font-semibold" : "")}
          />
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {modalMode === "create" ? (
              <PlusOutlined style={{ color: "#1677ff" }} />
            ) : (
              <EditOutlined style={{ color: "#faad14" }} />
            )}
            <span>{modalMode === "create" ? "Tạo thông báo mới" : "Chỉnh sửa thông báo"}</span>
          </div>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        okText={modalMode === "create" ? "Tạo" : "Lưu thay đổi"}
        cancelText="Hủy"
        confirmLoading={isPending}
        okButtonProps={{
          style: {
            background:
              modalMode === "create"
                ? "linear-gradient(135deg, #1677ff, #69b1ff)"
                : "linear-gradient(135deg, #faad14, #ffd666)",
            border: "none",
            borderRadius: 8,
          },
        }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        styles={{ header: { borderBottom: "1px solid #f0f0f0", paddingBottom: 16 } }}
        style={{ borderRadius: 16 }}
        width={520}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input
              prefix={<BellOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Nhập tiêu đề thông báo"
              size="large"
              maxLength={255}
              showCount
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea
              placeholder="Nhập nội dung mô tả (tùy chọn)"
              rows={3}
              maxLength={255}
              showCount
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="link"
            label="Liên kết"
            rules={[{ type: "url", message: "Liên kết không đúng định dạng", warningOnly: true }]}
          >
            <Input placeholder="https://... (tùy chọn)" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationPage;

import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  Tag,
  Tooltip,
  Popconfirm,
  Spin,
  Alert,
  Typography,
  Space,
  Badge,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  SaveOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { SystemConfigItem } from "@/types/systemConfig";
import { useSystemConfigData, useConfigPending } from "../useSystemconfig";
import { ConfigHistoryDrawer } from "./ConfigHistoryDrawer";

const { Text } = Typography;

/** Mini badge hiển thị "Ngày áp dụng" — fetch pending riêng từng row */
const PendingBadge = ({ configKey }: { configKey: string }) => {
  const { data, isLoading } = useConfigPending(configKey);
  if (isLoading) return <span className="text-gray-300 text-xs">...</span>;
  if (!data?.hasPending) return <span className="text-gray-400 text-xs">Hiện tại</span>;

  const effectiveDate = new Date(data.data!.effectiveDate).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Tooltip title={`Giá trị mới sẽ có hiệu lực từ ${effectiveDate}`}>
      <Badge dot color="orange">
        <Tag icon={<ClockCircleOutlined />} color="warning" className="text-xs cursor-default">
          {effectiveDate}
        </Tag>
      </Badge>
    </Tooltip>
  );
};

export const ConfigTab = () => {
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SystemConfigItem | null>(null);
  const [historyKey, setHistoryKey] = useState<string | null>(null);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const { query, updateMutation, upsertMutation, deleteMutation } = useSystemConfigData();
  const { data, isLoading, isError, refetch, isFetching } = query;

  const configs: SystemConfigItem[] = data?.data ?? [];
  const filtered = configs.filter(
    (c) =>
      c.key.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (item: SystemConfigItem) => {
    setEditingItem(item);
    editForm.setFieldsValue({ value: item.value, description: item.description });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    editForm.validateFields().then(({ value, description }) => {
      if (!editingItem) return;
      updateMutation.mutate({ key: editingItem.key, value, description }, { onSuccess: () => setEditModalOpen(false) });
    });
  };

  const handleAdd = () => {
    addForm.validateFields().then(({ key, value, description }) => {
      upsertMutation.mutate(
        { key: key.trim().toUpperCase(), value, description },
        {
          onSuccess: () => {
            setAddModalOpen(false);
            addForm.resetFields();
          },
        }
      );
    });
  };

  const columns = [
    {
      title: "Khóa cấu hình",
      dataIndex: "key",
      width: 220,
      render: (key: string) => (
        <Tag color="blue" className="font-mono text-xs font-bold">
          {key}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (desc: string) => <Text className="text-gray-600">{desc || "—"}</Text>,
    },
    {
      title: "Giá trị hiện tại",
      dataIndex: "value",
      width: 180,
      render: (value: string) => {
        const num = Number(value);
        const display = !isNaN(num) && value.trim() !== "" ? num.toLocaleString("vi-VN") : value;
        return <span className="text-base font-bold text-indigo-700">{display}</span>;
      },
    },
    {
      title: "Ngày áp dụng kế tiếp",
      width: 180,
      render: (_: unknown, record: SystemConfigItem) => <PendingBadge configKey={record.key} />,
    },
    {
      title: "Thao tác",
      width: 140,
      align: "center" as const,
      render: (_: unknown, record: SystemConfigItem) => (
        <Space>
          <Tooltip title="Xem lịch sử">
            <Button
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => setHistoryKey(record.key)}
              className="text-gray-500 border-gray-300 hover:text-indigo-600 hover:border-indigo-400"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="Xoá">
            <Popconfirm
              title={`Xoá cấu hình "${record.key}"?`}
              description="Hành động này không thể hoàn tác."
              okText="Xoá"
              cancelText="Hủy"
              okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
              onConfirm={() => deleteMutation.mutate(record.key)}
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Info banner về cơ chế ngày mai */}
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        className="rounded-xl"
        message="Lưu ý: Giá trị mới sau khi cập nhật sẽ chỉ có hiệu lực từ ngày hôm sau."
        description="Hóa đơn và báo cáo hôm nay vẫn sử dụng giá hiện tại. Nhấn biểu tượng đồng hồ để xem lịch sử thay đổi của từng cấu hình."
        closable
      />
      <div className="flex items-center justify-between mb-6 gap-3">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm theo khóa hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="max-w-xs"
        />
        <Space>
          <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            Thêm cấu hình
          </Button>
        </Space>
      </div>

      {isError ? (
        <Alert type="error" message="Không thể tải cấu hình hệ thống" showIcon />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={filtered.map((c) => ({ ...c, key: c.key }))}
              rowKey="key"
              pagination={false}
              bordered={false}
              size="middle"
              locale={{ emptyText: "Không có cấu hình nào" }}
              rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-slate-50")}
            />
          </Spin>
        </div>
      )}

      {/* ── Drawer lịch sử ── */}
      <ConfigHistoryDrawer configKey={historyKey} onClose={() => setHistoryKey(null)} />

      {/* ── Modal chỉnh sửa ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-indigo-600" />
            <span>Chỉnh sửa cấu hình</span>
            {editingItem && (
              <Tag color="blue" className="font-mono ml-1">
                {editingItem.key}
              </Tag>
            )}
          </div>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={updateMutation.isPending}
            onClick={handleEdit}
          >
            Lưu
          </Button>,
        ]}
      >
        <Alert
          type="warning"
          showIcon
          className="mb-4 rounded-lg"
          message="Giá trị mới sẽ có hiệu lực từ ngày mai"
          description="Hóa đơn và báo cáo hôm nay không bị ảnh hưởng."
        />
        <Form form={editForm} layout="vertical" className="mt-2">
          <Form.Item label="Giá trị mới" name="value" rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}>
            <Input autoFocus placeholder={editingItem?.value} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} placeholder="Mô tả cấu hình (tuỳ chọn)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Modal thêm mới ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined className="text-green-600" />
            <span>Thêm cấu hình mới</span>
          </div>
        }
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false);
          addForm.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAddModalOpen(false);
              addForm.resetFields();
            }}
          >
            Hủy
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            loading={upsertMutation.isPending}
            onClick={handleAdd}
          >
            Thêm
          </Button>,
        ]}
      >
        <Form form={addForm} layout="vertical" className="mt-4">
          <Form.Item
            label="Khóa cấu hình (KEY)"
            name="key"
            rules={[
              { required: true, message: "Vui lòng nhập khóa" },
              { pattern: /^[A-Z0-9_]+$/i, message: "Chỉ dùng chữ, số và dấu _" },
            ]}
          >
            <Input
              placeholder="VD: EXAMINE_FEE"
              className="font-mono uppercase"
              onChange={(e) => addForm.setFieldValue("key", e.target.value.toUpperCase())}
            />
          </Form.Item>
          <Form.Item label="Giá trị" name="value" rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}>
            <Input placeholder="VD: 50000" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn về cấu hình này" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

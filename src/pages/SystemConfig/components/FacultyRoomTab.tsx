import { useState } from 'react';
import {
  Button, Table, Tag, Space, Modal, Form, Input, Select, Popconfirm,
  Tooltip, Collapse, Badge, Alert, Spin, Typography,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, BankOutlined,
  HomeOutlined, ReloadOutlined,
} from '@ant-design/icons';
import {
  useFacultiesManage, useCreateFaculty, useUpdateFaculty, useDeleteFaculty,
  useCreateRoom, useUpdateRoom, useDeleteRoom,
} from '../useFacultyRoom';
import type { Faculty } from '@/apis/faculty';
import type { RoomOption } from '@/apis/room';
import HasPermission from '@/components/HasPermission';

const { Text } = Typography;

const ROOM_TYPES = [
  { value: 'examination', label: 'Phòng khám' },
  { value: 'pharmacy',    label: 'Nhà thuốc' },
  { value: 'cashier',     label: 'Thu ngân' },
  { value: 'lab',         label: 'Xét nghiệm' },
];

const roomTypeLabel = (type?: string) => ROOM_TYPES.find(t => t.value === type)?.label ?? type ?? '—';
const roomTypeColor = (type?: string) => ({
  examination: 'blue', pharmacy: 'green', cashier: 'orange', lab: 'purple',
}[type ?? ''] ?? 'default');

// ── Faculty Modal ──────────────────────────────────────────────────────────────
function FacultyModal({
  open, initial, onClose,
}: { open: boolean; initial?: Faculty; onClose: () => void }) {
  const [form] = Form.useForm();
  const create = useCreateFaculty();
  const update = useUpdateFaculty();
  const isEdit = !!initial;

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update.mutate({ id: initial!.facultyID, data: values }, { onSuccess: onClose });
      } else {
        create.mutate(values, { onSuccess: onClose });
      }
    });
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <BankOutlined className="text-indigo-600" />
          <span>{isEdit ? 'Chỉnh sửa khoa' : 'Thêm khoa mới'}</span>
        </div>
      }
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Lưu' : 'Thêm'}
      confirmLoading={create.isPending || update.isPending}
      afterOpenChange={open => {
        if (open) form.setFieldsValue(initial ?? {});
        else form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="facultyName" label="Tên khoa" rules={[{ required: true }]}>
          <Input placeholder="VD: Khoa Nội tổng quát" />
        </Form.Item>
        <Form.Item name="facultyDescription" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Mô tả ngắn về khoa" />
        </Form.Item>
        {isEdit && (
          <Form.Item name="status" label="Trạng thái">
            <Select options={[{ value: 'ACTIVE', label: 'Hoạt động' }, { value: 'INACTIVE', label: 'Ngừng' }]} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

// ── Room Modal ─────────────────────────────────────────────────────────────────
function RoomModal({
  open, initial, faculties, onClose,
}: { open: boolean; initial?: RoomOption; faculties: Faculty[]; onClose: () => void }) {
  const [form] = Form.useForm();
  const create = useCreateRoom();
  const update = useUpdateRoom();
  const isEdit = !!initial;

  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update.mutate({ id: initial!.roomID, data: values }, { onSuccess: onClose });
      } else {
        create.mutate(values, { onSuccess: onClose });
      }
    });
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <HomeOutlined className="text-blue-600" />
          <span>{isEdit ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</span>
        </div>
      }
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? 'Lưu' : 'Thêm'}
      confirmLoading={create.isPending || update.isPending}
      afterOpenChange={open => {
        if (open) form.setFieldsValue(initial ? {
          roomName: initial.roomName,
          roomType: initial.roomType,
          FacultyID: initial.FacultyID ?? initial.faculty?.facultyID,
          status: initial.status,
        } : {});
        else form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item name="roomName" label="Tên phòng" rules={[{ required: true }]}>
          <Input placeholder="VD: Phòng khám 01" />
        </Form.Item>
        <Form.Item name="roomType" label="Loại phòng" rules={[{ required: true }]}>
          <Select options={ROOM_TYPES} placeholder="Chọn loại phòng" />
        </Form.Item>
        <Form.Item name="FacultyID" label="Khoa">
          <Select
            allowClear
            placeholder="Chọn khoa (tuỳ chọn)"
            options={faculties.map(f => ({ value: f.facultyID, label: f.facultyName }))}
          />
        </Form.Item>
        {isEdit && (
          <Form.Item name="status" label="Trạng thái">
            <Select options={[{ value: 'ACTIVE', label: 'Hoạt động' }, { value: 'INACTIVE', label: 'Ngừng' }]} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

// ── Room Table inside Collapse panel ──────────────────────────────────────────
function RoomTable({ rooms, faculties }: { rooms: RoomOption[]; faculties: Faculty[] }) {
  const [editRoom, setEditRoom] = useState<RoomOption | undefined>();
  const [addRoom, setAddRoom] = useState(false);
  const deleteRoom = useDeleteRoom();

  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'roomName',
      render: (v: string) => <Text strong>{v || '—'}</Text>,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      render: (v: string) => (
        <Tag color={roomTypeColor(v)}>{roomTypeLabel(v)}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (v: string) => (
        <Badge
          status={v === 'ACTIVE' ? 'success' : 'default'}
          text={v === 'ACTIVE' ? 'Hoạt động' : 'Ngừng'}
        />
      ),
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      width: 100,
      render: (_: unknown, record: RoomOption) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => setEditRoom(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title={`Xóa phòng "${record.roomName}"?`}
              okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
              onConfirm={() => deleteRoom.mutate(record.roomID)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} loading={deleteRoom.isPending} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button size="small" type="dashed" icon={<PlusOutlined />} onClick={() => setAddRoom(true)}>
          Thêm phòng
        </Button>
      </div>
      <Table
        size="small"
        columns={columns}
        dataSource={rooms.map(r => ({ ...r, key: r.roomID }))}
        pagination={false}
        locale={{ emptyText: 'Chưa có phòng nào' }}
        bordered={false}
      />
      <RoomModal
        open={!!editRoom}
        initial={editRoom}
        faculties={faculties}
        onClose={() => setEditRoom(undefined)}
      />
      <RoomModal
        open={addRoom}
        faculties={faculties}
        onClose={() => setAddRoom(false)}
      />
    </div>
  );
}

// ── Main Tab ──────────────────────────────────────────────────────────────────
export const FacultyRoomTab = () => {
  const [facultyModal, setFacultyModal] = useState<{ open: boolean; item?: Faculty }>({ open: false });

  const { data: faculties = [], isLoading, isError, refetch, isFetching } = useFacultiesManage();
  const deleteFaculty = useDeleteFaculty();

  const collapseItems = faculties.map(faculty => ({
    key: faculty.facultyID,
    label: (
      <div className="flex items-center justify-between w-full pr-2">
        <div className="flex items-center gap-3">
          <BankOutlined className="text-indigo-500" />
          <span className="font-semibold text-gray-800">{faculty.facultyName}</span>
          <Badge count={faculty.rooms?.length ?? 0} showZero color="#6366f1"
            title={`${faculty.rooms?.length ?? 0} phòng`}
          />
          <Tag color={faculty.status === 'ACTIVE' ? 'success' : 'default'} className="text-xs">
            {faculty.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng'}
          </Tag>
        </div>
        {/* Chỉ hiện nút sửa/xóa khi có quyền manage */}
        <HasPermission requiredPermissions={['faculty.manage']}>
          <Space onClick={e => e.stopPropagation()}>
            <Tooltip title="Chỉnh sửa khoa">
              <Button
                size="small" type="primary" icon={<EditOutlined />}
                onClick={() => setFacultyModal({ open: true, item: faculty })}
              />
            </Tooltip>
            <Tooltip title="Xóa khoa">
              <Popconfirm
                title={`Xóa khoa "${faculty.facultyName}"?`}
                description="Tất cả phòng thuộc khoa này cũng sẽ bị ảnh hưởng."
                okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
                onConfirm={() => deleteFaculty.mutate(faculty.facultyID)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} loading={deleteFaculty.isPending} />
              </Popconfirm>
            </Tooltip>
          </Space>
        </HasPermission>
      </div>
    ),
    children: (
      <HasPermission
        requiredPermissions={['room.manage']}
        fallback={
          <Table
            size="small"
            columns={[
              { title: 'Tên phòng', dataIndex: 'roomName', render: (v: string) => <Text strong>{v || '—'}</Text> },
              { title: 'Loại phòng', dataIndex: 'roomType', render: (v: string) => <Tag color={roomTypeColor(v)}>{roomTypeLabel(v)}</Tag> },
              { title: 'Trạng thái', dataIndex: 'status', render: (v: string) => <Badge status={v === 'ACTIVE' ? 'success' : 'default'} text={v === 'ACTIVE' ? 'Hoạt động' : 'Ngừng'} /> },
            ]}
            dataSource={(faculty.rooms ?? []).map(r => ({ ...r, key: r.roomID }))}
            pagination={false}
            locale={{ emptyText: 'Chưa có phòng nào' }}
          />
        }
      >
        <RoomTable rooms={faculty.rooms ?? []} faculties={faculties} />
      </HasPermission>
    ),
  }));

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <Text className="text-gray-500 text-sm">
          {faculties.length} khoa · {faculties.reduce((s, f) => s + (f.rooms?.length ?? 0), 0)} phòng
        </Text>
        <Space>
          <Button icon={<ReloadOutlined spin={isFetching} />} onClick={() => refetch()}>
            Làm mới
          </Button>
          {/* Nút Thêm khoa chỉ xuất hiện khi có faculty.manage */}
          <HasPermission requiredPermissions={['faculty.manage']}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setFacultyModal({ open: true })}>
              Thêm khoa
            </Button>
          </HasPermission>
        </Space>
      </div>

      {/* Info */}
      <Alert
        type="info" showIcon className="mb-4 rounded-xl"
        message="Mỗi khoa có thể có nhiều phòng. Mở rộng từng khoa để xem và quản lý các phòng bên trong."
        closable
      />

      {isError && (
        <Alert type="error" message="Không thể tải danh sách khoa & phòng" showIcon className="mb-4" />
      )}

      <Spin spinning={isLoading}>
        {faculties.length === 0 && !isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <BankOutlined style={{ fontSize: 48 }} className="mb-4 opacity-30" />
            <p>Chưa có khoa nào. Hãy thêm khoa đầu tiên!</p>
          </div>
        ) : (
          <Collapse
            accordion={false}
            items={collapseItems}
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
            expandIconPosition="start"
          />
        )}
      </Spin>

      {/* Faculty modal */}
      <FacultyModal
        open={facultyModal.open}
        initial={facultyModal.item}
        onClose={() => setFacultyModal({ open: false })}
      />
    </div>
  );
};

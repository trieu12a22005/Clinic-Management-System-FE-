import { useState } from 'react';
import { Table, Input, Button, Modal, Form, Tag, Tooltip, Popconfirm, Spin, Alert, Typography, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import type { SystemConfigItem } from '@/types/systemConfig';
import { useSystemConfigData } from '../useSystemconfig';

const { Text } = Typography;
const QUERY_KEY = ['system-config'];

export const ConfigTab = () => {
    const [search, setSearch] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SystemConfigItem | null>(null);
    const [editForm] = Form.useForm();
    const [addForm] = Form.useForm();

    const { query, updateMutation, upsertMutation, deleteMutation } = useSystemConfigData();
    const { data, isLoading, isError, refetch, isFetching } = query;

    const configs: SystemConfigItem[] = data?.data ?? [];
    const filtered = configs.filter(
        (c) =>
            c.key.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase()),
    );

    const openEdit = (item: SystemConfigItem) => {
        setEditingItem(item);
        editForm.setFieldsValue({ value: item.value, description: item.description });
        setEditModalOpen(true);
    };

    const handleEdit = () => {
        editForm.validateFields().then(({ value, description }) => {
            if (!editingItem) return;
            updateMutation.mutate(
                { key: editingItem.key, value, description },
                { onSuccess: () => setEditModalOpen(false) }
            );
        });
    };

    const handleAdd = () => {
        addForm.validateFields().then(({ key, value, description }) => {
            upsertMutation.mutate(
                { key: key.trim().toUpperCase(), value, description },
                { onSuccess: () => { setAddModalOpen(false); addForm.resetFields(); } }
            );
        });
    };

    const columns = [
        {
            title: 'Khóa cấu hình',
            dataIndex: 'key',
            width: 240,
            render: (key: string) => (
                <Tag color="blue" className="font-mono text-xs font-bold">
                    {key}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            render: (desc: string) => <Text className="text-gray-600">{desc || '—'}</Text>,
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            width: 180,
            render: (value: string) => {
                const num = Number(value);
                const display = !isNaN(num) && value.trim() !== ''
                    ? num.toLocaleString('vi-VN')
                    : value;
                return (
                    <span className="text-base font-bold text-indigo-700">{display}</span>
                );
            },
        },
        {
            title: 'Thao tác',
            width: 120,
            align: 'center' as const,
            render: (_: unknown, record: SystemConfigItem) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                        />
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
                            locale={{ emptyText: 'Không có cấu hình nào' }}
                            rowClassName={(_, i) => i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        />
                    </Spin>
                </div>
            )}

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <EditOutlined className="text-indigo-600" />
                        <span>Chỉnh sửa cấu hình</span>
                        {editingItem && <Tag color="blue" className="font-mono ml-1">{editingItem.key}</Tag>}
                    </div>
                }
                open={editModalOpen}
                onCancel={() => setEditModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setEditModalOpen(false)}>Hủy</Button>,
                    <Button key="save" type="primary" icon={<SaveOutlined />} loading={updateMutation.isPending} onClick={handleEdit}>Lưu</Button>,
                ]}
            >
                <Form form={editForm} layout="vertical" className="mt-4">
                    <Form.Item label="Giá trị" name="value" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
                        <Input autoFocus />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={2} placeholder="Mô tả cấu hình (tuỳ chọn)" />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <PlusOutlined className="text-green-600" />
                        <span>Thêm cấu hình mới</span>
                    </div>
                }
                open={addModalOpen}
                onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
                footer={[
                    <Button key="cancel" onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>Hủy</Button>,
                    <Button key="add" type="primary" icon={<PlusOutlined />} loading={upsertMutation.isPending} onClick={handleAdd}>Thêm</Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Khóa cấu hình (KEY)"
                        name="key"
                        rules={[
                            { required: true, message: 'Vui lòng nhập khóa' },
                            { pattern: /^[A-Z0-9_]+$/i, message: 'Chỉ dùng chữ, số và dấu _' },
                        ]}
                    >
                        <Input placeholder="VD: EXAMINE_FEE" className="font-mono uppercase" onChange={(e) => addForm.setFieldValue('key', e.target.value.toUpperCase())} />
                    </Form.Item>
                    <Form.Item label="Giá trị" name="value" rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}>
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

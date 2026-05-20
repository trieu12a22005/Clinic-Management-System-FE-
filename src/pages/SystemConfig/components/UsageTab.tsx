import { useState } from 'react';
import { Table, Input, Button, Modal, Form, Tag, Tooltip, Popconfirm, Spin, Alert, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMedicineUsageData } from '../useSystemconfig';

export const UsageTab = () => {
    const [search, setSearch] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();

    const { query, addMutation, deleteMutation } = useMedicineUsageData();
    const { data: response, isLoading, isError, refetch, isFetching } = query;

    const usages = response?.data || [];
    const filtered = usages.filter(u => u.usage.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        addForm.validateFields().then(({ usage }) => {
            addMutation.mutate(usage.trim(), {
                onSuccess: () => {
                    setAddModalOpen(false);
                    addForm.resetFields();
                }
            });
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 100,
            render: (id: number) => <Tag color="green">#{id}</Tag>,
        },
        {
            title: 'Cách dùng thuốc',
            dataIndex: 'usage',
            render: (name: string) => <Typography.Text className="font-semibold text-gray-800">{name}</Typography.Text>,
        },
        {
            title: 'Thao tác',
            width: 120,
            align: 'center' as const,
            render: (_: unknown, record: any) => (
                <Space>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title={`Xoá cách dùng "${record.usage}"?`}
                            description="Hành động này không thể hoàn tác."
                            okText="Xoá"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
                            onConfirm={() => deleteMutation.mutate(record.id)}
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
                    placeholder="Tìm theo cách dùng..."
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
                        Thêm cách dùng
                    </Button>
                </Space>
            </div>

            {isError ? (
                <Alert type="error" message="Không thể tải danh sách cách dùng" showIcon />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Spin spinning={isLoading}>
                        <Table
                            columns={columns}
                            dataSource={filtered}
                            rowKey="id"
                            pagination={false}
                            bordered={false}
                            size="middle"
                            locale={{ emptyText: 'Không có cách dùng nào' }}
                            rowClassName={(_, i) => i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        />
                    </Spin>
                </div>
            )}

            <Modal
                title="Thêm cách dùng thuốc"
                open={addModalOpen}
                onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
                footer={[
                    <Button key="cancel" onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>Hủy</Button>,
                    <Button key="add" type="primary" loading={addMutation.isPending} onClick={handleAdd}>Thêm</Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Cách dùng"
                        name="usage"
                        rules={[{ required: true, message: 'Vui lòng nhập cách dùng' }]}
                    >
                        <Input placeholder="VD: Uống sau ăn, Thoa ngoài da..." autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

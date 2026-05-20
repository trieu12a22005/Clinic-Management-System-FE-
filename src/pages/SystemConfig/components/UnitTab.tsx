import { useState } from 'react';
import { Table, Input, Button, Modal, Form, Tag, Tooltip, Popconfirm, Spin, Alert, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useMedicineUnitData } from '../useSystemconfig';

export const UnitTab = () => {
    const [search, setSearch] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [addForm] = Form.useForm();

    const { query, addMutation, deleteMutation } = useMedicineUnitData();
    const { data: response, isLoading, isError, refetch, isFetching } = query;

    const units = response?.data || [];
    const filtered = units.filter(u => u.unitName.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        addForm.validateFields().then(({ unitName }) => {
            addMutation.mutate(unitName.trim(), {
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
            dataIndex: 'unitID',
            width: 100,
            render: (id: number) => <Tag color="purple">#{id}</Tag>,
        },
        {
            title: 'Tên đơn vị',
            dataIndex: 'unitName',
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
                            title={`Xoá đơn vị "${record.unitName}"?`}
                            description="Hành động này không thể hoàn tác."
                            okText="Xoá"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
                            onConfirm={() => deleteMutation.mutate(record.unitID)}
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
                    placeholder="Tìm theo tên đơn vị..."
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
                        Thêm đơn vị
                    </Button>
                </Space>
            </div>

            {isError ? (
                <Alert type="error" message="Không thể tải danh sách đơn vị" showIcon />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Spin spinning={isLoading}>
                        <Table
                            columns={columns}
                            dataSource={filtered}
                            rowKey="unitID"
                            pagination={false}
                            bordered={false}
                            size="middle"
                            locale={{ emptyText: 'Không có đơn vị nào' }}
                            rowClassName={(_, i) => i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        />
                    </Spin>
                </div>
            )}

            <Modal
                title="Thêm đơn vị thuốc mới"
                open={addModalOpen}
                onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
                footer={[
                    <Button key="cancel" onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>Hủy</Button>,
                    <Button key="add" type="primary" loading={addMutation.isPending} onClick={handleAdd}>Thêm</Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Tên đơn vị"
                        name="unitName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị' }]}
                    >
                        <Input placeholder="VD: Hộp, Lọ, Chai..." autoFocus />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

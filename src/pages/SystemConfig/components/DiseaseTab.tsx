import { useState } from 'react';
import { Table, Input, Button, Modal, Form, Tag, Tooltip, Popconfirm, Spin, Alert, Space } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDiseaseData } from '../useSystemconfig';

export const DiseaseTab = () => {
    const [search, setSearch] = useState('');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();

    const { query, addMutation, updateMutation, deleteMutation } = useDiseaseData();
    const { data: response, isLoading, isError, refetch, isFetching } = query;

    const diseases = response?.data?.data || [];
    const filtered = diseases.filter((d: any) =>
        d.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
        d.diseaseID.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        addForm.validateFields().then((values) => {
            addMutation.mutate({
                diseaseID: values.diseaseID.trim(),
                diseaseName: values.diseaseName.trim(),
                note: values.note?.trim(),
            }, {
                onSuccess: () => {
                    setAddModalOpen(false);
                    addForm.resetFields();
                }
            });
        });
    };

    const handleEdit = () => {
        editForm.validateFields().then((values) => {
            updateMutation.mutate({
                id: editingItem.diseaseID,
                data: {
                    diseaseName: values.diseaseName.trim(),
                    note: values.note?.trim(),
                }
            }, {
                onSuccess: () => {
                    setEditModalOpen(false);
                    editForm.resetFields();
                }
            });
        });
    };

    const openEdit = (record: any) => {
        setEditingItem(record);
        editForm.setFieldsValue({
            diseaseID: record.diseaseID,
            diseaseName: record.diseaseName,
            note: record.note,
        });
        setEditModalOpen(true);
    };

    const columns = [
        {
            title: 'Mã bệnh',
            dataIndex: 'diseaseID',
            width: 150,
            render: (id: string) => <Tag color="blue" className="font-mono">{id}</Tag>,
        },
        {
            title: 'Tên bệnh',
            dataIndex: 'diseaseName',
            render: (name: string) => <span className="font-semibold text-gray-800">{name}</span>,
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            render: (note: string) => <span className="text-gray-500">{note || '—'}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>{status}</Tag>
            ),
        },
        {
            title: 'Thao tác',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Popconfirm
                            title={`Xoá loại bệnh "${record.diseaseName}"?`}
                            description="Bạn có chắc chắn muốn xoá loại bệnh này?"
                            okText="Xoá"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading: deleteMutation.isPending }}
                            onConfirm={() => deleteMutation.mutate(record.diseaseID)}
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
                    placeholder="Tìm mã hoặc tên bệnh..."
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
                        Thêm loại bệnh
                    </Button>
                </Space>
            </div>

            {isError ? (
                <Alert type="error" message="Không thể tải danh sách loại bệnh" showIcon />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Spin spinning={isLoading}>
                        <Table
                            columns={columns}
                            dataSource={filtered}
                            rowKey="diseaseID"
                            pagination={{ pageSize: 10, showSizeChanger: false }}
                            bordered={false}
                            size="middle"
                            locale={{ emptyText: 'Không có loại bệnh nào' }}
                            rowClassName={(_, i) => i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        />
                    </Spin>
                </div>
            )}

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <PlusOutlined className="text-green-600" />
                        <span>Thêm loại bệnh mới</span>
                    </div>
                }
                open={addModalOpen}
                onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
                footer={[
                    <Button key="cancel" onClick={() => { setAddModalOpen(false); addForm.resetFields(); }}>Hủy</Button>,
                    <Button key="add" type="primary" icon={<PlusOutlined />} loading={addMutation.isPending} onClick={handleAdd}>Thêm</Button>,
                ]}
            >
                <Form form={addForm} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Mã bệnh (ICD)"
                        name="diseaseID"
                        rules={[{ required: true, message: 'Vui lòng nhập mã bệnh' }]}
                    >
                        <Input placeholder="VD: A00" autoFocus className="font-mono uppercase" onChange={(e) => addForm.setFieldValue('diseaseID', e.target.value.toUpperCase())} />
                    </Form.Item>
                    <Form.Item
                        label="Tên bệnh"
                        name="diseaseName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bệnh' }]}
                    >
                        <Input placeholder="VD: Bệnh Tả" />
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="note"
                    >
                        <Input.TextArea rows={2} placeholder="Mô tả hoặc ghi chú..." />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <EditOutlined className="text-indigo-600" />
                        <span>Chỉnh sửa loại bệnh</span>
                    </div>
                }
                open={editModalOpen}
                onCancel={() => { setEditModalOpen(false); editForm.resetFields(); }}
                footer={[
                    <Button key="cancel" onClick={() => { setEditModalOpen(false); editForm.resetFields(); }}>Hủy</Button>,
                    <Button key="save" type="primary" icon={<EditOutlined />} loading={updateMutation.isPending} onClick={handleEdit}>Lưu</Button>,
                ]}
            >
                <Form form={editForm} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Mã bệnh"
                        name="diseaseID"
                    >
                        <Input disabled className="font-mono" />
                    </Form.Item>
                    <Form.Item
                        label="Tên bệnh"
                        name="diseaseName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bệnh' }]}
                    >
                        <Input autoFocus placeholder="VD: Bệnh Tả" />
                    </Form.Item>
                    <Form.Item
                        label="Ghi chú"
                        name="note"
                    >
                        <Input.TextArea rows={2} placeholder="Mô tả hoặc ghi chú..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

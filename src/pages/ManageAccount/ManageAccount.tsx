import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Upload, message, Card } from 'antd';
import { FiPlus, FiUpload, FiEdit, FiTrash2 } from 'react-icons/fi';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import type { RegisterManyPayload, Account } from '@/types/ManageAccount';
import { useManageAccount } from './useManageAccount';

const ManageAccount: React.FC = () => {
    const {
        accountsQuery,
        createAccountMutation,
        updateAccountMutation,
        deleteAccountMutation,
        importAccountsMutation,
        rolesQuery,
    } = useManageAccount();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const showModal = (record?: Account) => {
        if (record) {
            setEditingKey(record.accountID?.toString() || record.key || '');
            form.setFieldsValue(record);
        } else {
            setEditingKey(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (editingKey) {
                updateAccountMutation.mutate(
                    { id: editingKey, data: values },
                    { onSuccess: () => setIsModalVisible(false) }
                );
            } else {
                createAccountMutation.mutate(
                    values,
                    { onSuccess: () => setIsModalVisible(false) }
                );
            }
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDelete = (key: string) => {
        deleteAccountMutation.mutate(key);
    };

    const uploadProps: UploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);

                    // Chuyển đổi dữ liệu từ Excel sang format API
                    const payload: RegisterManyPayload[] = parsedData.map(row => ({
                        firstName: row.firstName || row['Tên'] || '',
                        lastName: row.lastName || row['Họ'] || '',
                        role: row.role || row['Vai trò'] || '',
                        email: row.email || row['Email'] || '',
                        birthDate: row.birthDate || row['Ngày sinh'] || '',
                        phoneNumber: row.phoneNumber || row['Số điện thoại'] || ''
                    }));

                    console.log('Dữ liệu JSON gửi lên API:', payload);
                    // Gọi API import
                    await importAccountsMutation.mutateAsync(payload);
                    message.success(`Đã phân tích và import thành công ${payload.length} tài khoản.`);
                } catch (error) {
                    console.error(error);
                    message.error('Lỗi khi đọc file Excel hoặc gọi API.');
                }
            };
            reader.readAsBinaryString(file);
            return false; // Ngăn chặn hành vi upload mặc định của Antd
        },
        showUploadList: false,
    };

    const columns = [
        {
            title: 'Email',
            key: 'email',
            render: (_: any, record: Account) => record.email || '',
        },
        {
            title: 'Họ và tên',
            key: 'fullName',
            render: (_: any, record: Account) => `${record.firstName || ''} ${record.lastName || ''}`.trim() || '—',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (v: string) => v || '—',
        },
        {
            title: 'Vai trò (Role)',
            key: 'role',
            render: (_: any, record: any) => {
                const roleName = record.role?.roleName || record.roleName || record.role || 'Unknown';
                let color = roleName.toLowerCase() === 'admin' ? 'geekblue' : roleName.toLowerCase() === 'doctor' ? 'green' : 'volcano';
                return <Tag color={color}>{roleName.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'Active' ? 'success' : 'error'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: Account) => (
                <Space size="middle">
                    <Button type="text" className="text-blue-500 hover:bg-blue-50" icon={<FiEdit />} onClick={() => showModal(record)} />
                    <Button type="text" danger icon={<FiTrash2 />} onClick={() => handleDelete(record.accountID || record.key || '')} />
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card title={<h2 className="text-2xl font-bold text-gray-800">Quản lý Tài Khoản</h2>} className="shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <Input.Search
                        placeholder="Tìm kiếm tài khoản..."
                        allowClear
                        style={{ width: 300 }}
                        size="large"
                    />
                    <Space>
                        <Upload {...uploadProps} showUploadList={false}>
                            <Button size="large" icon={<FiUpload />} type="default">
                                Nhập từ Excel
                            </Button>
                        </Upload>
                        <Button size="large" type="primary" icon={<FiPlus />} onClick={() => showModal()}>
                            Tạo tài khoản
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={
                        (Array.isArray(accountsQuery.data) ? accountsQuery.data : []).filter((acc: any) => {
                            const roleName = acc.role?.roleName || acc.roleName || acc.role || '';
                            return roleName && roleName.toLowerCase() !== 'unknown';
                        })
                    }
                    loading={accountsQuery.isLoading}
                    pagination={{ pageSize: 8 }}
                    rowKey={(record) => record.accountID?.toString() || record.key || record.email || Math.random().toString()}
                />

                <Modal
                    title={<span className="text-lg font-semibold">{editingKey ? "Chỉnh sửa tài khoản" : "Tạo tài khoản mới"}</span>}
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText={editingKey ? "Cập nhật" : "Tạo mới"}
                    cancelText="Hủy"
                    width={600}
                >
                    <Form form={form} layout="vertical" name="accountForm" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="firstName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                            >
                                <Input placeholder="Nhập tên" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label="Họ"
                                rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                            >
                                <Input placeholder="Nhập họ" size="large" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Nhập địa chỉ email" size="large" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="role"
                                label="Vai trò"
                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                            >
                                <Select
                                    placeholder="Chọn vai trò"
                                    size="large"
                                    loading={rolesQuery.isLoading}
                                    options={(rolesQuery.data ?? []).map((r) => ({
                                        value: r.roleID,
                                        label: `${r.roleName} — ${r.roleDescription}`,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input placeholder="+84912345678" size="large" />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="birthDate"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
                        >
                            <Input placeholder="YYYY-MM-DD (VD: 1990-01-15)" size="large" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default ManageAccount;

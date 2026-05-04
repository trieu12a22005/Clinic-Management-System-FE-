import { useEffect, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    Skeleton,
    Tag,
    Typography,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    EditOutlined,
    IdcardOutlined,
    CheckCircleOutlined,
    MedicineBoxOutlined,
    CalendarOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { useProfile, useUpdateProfile } from './useProfile';
import type { AuthRespone } from '@/types/Auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const roleColorMap: Record<string, string> = {
    ADMIN: '#f5222d',
    DOCTOR: '#1677ff',
    NURSE: '#52c41a',
    PHARMACIST: '#fa8c16',
    RECEPTIONIST: '#722ed1',
};

const roleIconMap: Record<string, React.ReactNode> = {
    ADMIN: <MedicineBoxOutlined />,
    DOCTOR: <MedicineBoxOutlined />,
    NURSE: <MedicineBoxOutlined />,
    PHARMACIST: <MedicineBoxOutlined />,
    RECEPTIONIST: <IdcardOutlined />,
};

const Profile = () => {
    const { profile, isLoading, isError } = useProfile();
    const updateProfile = useUpdateProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();

    // Populate form whenever profile data loads
    useEffect(() => {
        if (profile && isEditModalOpen) {
            editForm.setFieldsValue({
                firstName: profile.firstName,
                lastName: profile.lastName,
                birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
            });
        }
    }, [profile, isEditModalOpen, editForm]);

    /* ---------- Loading ---------- */
    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] py-8 px-6" style={{ background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 50%, #f6ffed 100%)' }}>
                <div className="max-w-4xl mx-auto">
                    <Card style={{ borderRadius: 16, border: 'none', marginBottom: 24 }}>
                        <Skeleton active avatar={{ size: 100 }} paragraph={{ rows: 2 }} />
                    </Card>
                    <Card style={{ borderRadius: 16, border: 'none' }}>
                        <Skeleton active paragraph={{ rows: 5 }} />
                    </Card>
                </div>
            </div>
        );
    }

    /* ---------- Error ---------- */
    if (isError || !profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="text-center p-8" style={{ borderRadius: 16, border: 'none' }}>
                    <WarningOutlined style={{ fontSize: 48, color: '#faad14' }} />
                    <Title level={4} style={{ marginTop: 16, color: '#8c8c8c' }}>
                        Không thể tải thông tin cá nhân
                    </Title>
                    <Text type="secondary">Vui lòng thử lại sau.</Text>
                </Card>
            </div>
        );
    }

    const fullName = `${profile.firstName} ${profile.lastName}`;
    const roleColor = roleColorMap[profile.roleName?.toUpperCase()] || '#1677ff';
    const roleIcon = roleIconMap[profile.roleName?.toUpperCase()] || <UserOutlined />;

    /* ---------- Handlers ---------- */
    const handleOpenEdit = () => {
        editForm.setFieldsValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const values = await editForm.validateFields();
            const payload: AuthRespone = {
                ...profile,
                firstName: values.firstName,
                lastName: values.lastName,
                birthDate: values.birthDate ? dayjs(values.birthDate).format('YYYY-MM-DD') : profile.birthDate,
            };
            await updateProfile.mutateAsync(payload);
            setIsEditModalOpen(false);
        } catch {
            // validation failed — antd form already shows inline errors
        }
    };

    /* ---------- Render ---------- */
    return (
        <div
            className="min-h-[calc(100vh-64px)] py-8 px-6"
            style={{ background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 50%, #f6ffed 100%)' }}
        >
            <div className="max-w-4xl mx-auto">

                {/* ── Profile Header Card ── */}
                <Card
                    className="mb-6 overflow-hidden"
                    styles={{ body: { padding: 0 } }}
                    style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: 'none' }}
                >
                    {/* Banner */}
                    <div
                        style={{
                            height: 160,
                            background: `linear-gradient(135deg, ${roleColor}dd 0%, ${roleColor}88 50%, #1677ff44 100%)`,
                            position: 'relative',
                        }}
                    >
                        {/* Verified badge */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 24,
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 12,
                                padding: '6px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <CheckCircleOutlined style={{ color: '#fff' }} />
                            <Text style={{ color: '#fff', fontSize: 13 }}>Tài khoản đã xác thực</Text>
                        </div>

                        {/* Decorative circles */}
                        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: -60, left: -40 }} />
                        <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: -30, right: 80 }} />
                    </div>

                    {/* Avatar & Name */}
                    <div style={{ padding: '0 32px 32px', marginTop: -50 }}>
                        <div className="flex items-end gap-6">
                            <Avatar
                                size={100}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#fff',
                                    color: roleColor,
                                    border: '4px solid #fff',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                                    fontSize: 42,
                                }}
                            />
                            <div className="flex-1 pb-1">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <Title level={3} style={{ margin: 0, color: '#262626' }}>
                                            {fullName}
                                        </Title>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MailOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                                            <Text type="secondary">{profile.email}</Text>
                                        </div>
                                    </div>
                                    <Tag
                                        icon={roleIcon}
                                        color={roleColor}
                                        style={{ fontSize: 14, padding: '4px 16px', borderRadius: 20, fontWeight: 600 }}
                                    >
                                        {profile.roleName}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ── Personal Information Card ── */}
                <Card
                    title={
                        <div className="flex items-center gap-2">
                            <IdcardOutlined style={{ color: roleColor, fontSize: 18 }} />
                            <span style={{ fontSize: 16, fontWeight: 600 }}>Thông tin cá nhân</span>
                        </div>
                    }
                    extra={
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleOpenEdit}
                            style={{ borderRadius: 8, background: roleColor, borderColor: roleColor }}
                        >
                            Chỉnh sửa
                        </Button>
                    }
                    style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: 'none' }}
                >
                    <div className="space-y-5">
                        <InfoRow
                            label="Mã nhân viên"
                            value={`NV-${String(profile.accountID).padStart(4, '0')}`}
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <InfoRow label="Họ" value={profile.firstName} />
                        <Divider style={{ margin: '12px 0' }} />
                        <InfoRow label="Tên" value={profile.lastName} />
                        <Divider style={{ margin: '12px 0' }} />
                        <InfoRow label="Email" value={profile.email} />
                        <Divider style={{ margin: '12px 0' }} />
                        <InfoRow
                            label="Ngày sinh"
                            value={
                                profile.birthDate
                                    ? dayjs(profile.birthDate).format('DD/MM/YYYY')
                                    : <Text type="secondary">Chưa cập nhật</Text>
                            }
                        />
                        <Divider style={{ margin: '12px 0' }} />
                        <InfoRow
                            label="Vai trò"
                            value={
                                <Tag color={roleColor} style={{ borderRadius: 6, fontWeight: 500 }}>
                                    {profile.roleName}
                                </Tag>
                            }
                        />
                    </div>
                </Card>
            </div>

            {/* ── Edit Profile Modal ── */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <EditOutlined style={{ color: roleColor }} />
                        <span>Chỉnh sửa thông tin cá nhân</span>
                    </div>
                }
                open={isEditModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Lưu thay đổi"
                cancelText="Hủy"
                confirmLoading={updateProfile.isPending}
                okButtonProps={{
                    style: { background: roleColor, borderColor: roleColor, borderRadius: 8 },
                }}
                cancelButtonProps={{ style: { borderRadius: 8 } }}
                styles={{ header: { borderBottom: '1px solid #f0f0f0', paddingBottom: 16 } }}
                style={{ borderRadius: 16 }}
            >
                <Form form={editForm} layout="vertical" style={{ marginTop: 20 }}>
                    <Form.Item
                        name="firstName"
                        label="Họ"
                        rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Nhập họ"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Nhập tên"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="birthDate"
                        label="Ngày sinh"
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            placeholder="Chọn ngày sinh"
                            size="large"
                            style={{ width: '100%', borderRadius: 8 }}
                            suffixIcon={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                            disabledDate={(d) => d && d.isAfter(dayjs())}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

/* ── Info Row Component ── */
const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-center justify-between">
        <Text type="secondary" style={{ fontSize: 14 }}>
            {label}
        </Text>
        <Text strong style={{ fontSize: 14 }}>
            {value}
        </Text>
    </div>
);

export default Profile;
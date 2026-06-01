import { useCallback } from "react";
import { Avatar, Button, Card, Divider, Skeleton, Tag, Typography } from "antd";
import { UserOutlined, MailOutlined, EditOutlined, IdcardOutlined, WarningOutlined } from "@ant-design/icons";
import { selfProfileViewSelector, useProfile } from "./useProfile";
import dayjs from "dayjs";
import UpdateModal from "./UpdateModal";
import useStore from "@/store/useStore";

const { Title, Text } = Typography;

const Profile = () => {
  const { data: profile, isLoading, isError } = useProfile(selfProfileViewSelector);

  const trigger = useStore((state) => state.behaviour.modal.trigger);
  const toggleModalHandler = useCallback(() => {
    if (trigger) {
      trigger("edit-profile");
    }
  }, [trigger]);

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div
        className="min-h-[calc(100vh-64px)] py-8 px-6"
        style={{ background: "linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 50%, #f6ffed 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <Card style={{ borderRadius: 16, border: "none", marginBottom: 24 }}>
            <Skeleton active avatar={{ size: 100 }} paragraph={{ rows: 2 }} />
          </Card>
          <Card style={{ borderRadius: 16, border: "none" }}>
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
        <Card className="text-center p-8" style={{ borderRadius: 16, border: "none" }}>
          <WarningOutlined style={{ fontSize: 48, color: "#faad14" }} />
          <Title level={4} style={{ marginTop: 16, color: "#8c8c8c" }}>
            Không thể tải thông tin cá nhân
          </Title>
          <Text type="secondary">Vui lòng thử lại sau.</Text>
        </Card>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const roleColor = "#1677ff";
  const roleIcon = <UserOutlined />;

  /* ---------- Render ---------- */
  return (
    <div
      className="min-h-[calc(100vh-64px)] py-8 px-6"
      style={{ background: "linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 50%, #f6ffed 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Profile Header Card ── */}
        <Card
          className="mb-6 overflow-hidden"
          styles={{ body: { padding: 0 } }}
          style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "none", marginBottom: 24 }}
        >
          {/* Banner */}

          {/* Avatar & Name */}
          <div style={{ padding: "32px" }}>
            <div className="flex items-start gap-6">
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: "#fff",
                  color: roleColor,
                  border: "4px solid #fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  fontSize: 42,
                }}
              />
              <div className="flex-1 pb-1">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <Title level={3} style={{ margin: 0, color: "#262626" }}>
                      {fullName}
                    </Title>
                    <div className="flex items-center gap-2 mt-1">
                      <MailOutlined style={{ color: "#8c8c8c", fontSize: 14 }} />
                      <Text type="secondary">{profile.email}</Text>
                    </div>
                    <Tag
                      icon={roleIcon}
                      color={roleColor}
                      style={{ fontSize: 14, padding: "4px 16px", borderRadius: 20, fontWeight: 600, marginTop: 16 }}
                    >
                      {profile.role.roleDescription}
                    </Tag>
                  </div>
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
              onClick={toggleModalHandler}
              style={{ borderRadius: 8, background: roleColor, borderColor: roleColor }}
            >
              Chỉnh sửa
            </Button>
          }
          style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "none" }}
        >
          <div className="space-y-5">
            <InfoRow label="Mã nhân viên" value={`${String(profile.DisplayID)}`} />
            <Divider style={{ margin: "12px 0" }} />

            <InfoRow label="Email" value={profile.email} />
            <Divider style={{ margin: "12px 0" }} />
            <InfoRow
              label="Ngày sinh"
              value={
                profile.birthDate ? (
                  dayjs(profile.birthDate).format("DD/MM/YYYY")
                ) : (
                  <Text type="secondary">Chưa cập nhật</Text>
                )
              }
            />
          </div>
        </Card>
      </div>

      {/* ── Edit Profile Modal ── */}
      <UpdateModal />
    </div>
  );
};

/* ── Info Row Component ── */
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
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

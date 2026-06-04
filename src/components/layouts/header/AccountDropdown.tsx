import { Avatar, Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "@/apis/auth";
import toast from "react-hot-toast";
import { useProfile } from "@/hooks/useProfile";
import { query } from "@/lib/queryClient";
import HasPermission from "@/components/HasPermission";
import { useCheckPermission } from "@/hooks/useCheckPermission";
// import { UseAuth } from "@/AuthContext";
function AccountDropdownComponent() {
  const { data: user } = useProfile(); // UseAuth();
  const { hasPermission } = useCheckPermission();
  const queryClient = useQueryClient();
  const currentName = user ? `${user.firstName} ${user.lastName}` : "";
  const avatarUrl = user?.avatar;
  const mutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success("Đăng xuất thành công");
      localStorage.removeItem("user");
      queryClient.removeQueries({
        queryKey: query.profile,
      });
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error(error?.message || "Đăng xuất thất bại");
    },
  });
  const navigate = useNavigate();

  const items2: MenuProps["items"] = [
    ...(hasPermission(["role.manage"])
      ? [
          {
            key: "1",
            label: "Cấu hình hệ thống",
          },
        ]
      : []),
    {
      key: "2",
      label: "Trang cá nhân",
    },
    {
      type: "divider" as const,
    },
    {
      key: "3",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleClick: MenuProps["onClick"] = (e) => {
    if (e.key === "1") navigate("/system-config");
    else if (e.key === "2") navigate("/profile");
    else if (e.key === "3") mutation.mutate();
  };
  return (
    <>
      <div className="flex items-center">
        {currentName !== "" ? (
          <Dropdown menu={{ items: items2, onClick: handleClick }} placement="bottomRight" arrow>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ color: "#1f2937" }} className="cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar
                  size="default"
                  src={avatarUrl || undefined}
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  style={{ backgroundColor: "#4f46e5" }}
                />
                <span className="font-medium text-gray-800">{currentName}</span>
                <DownOutlined style={{ fontSize: 12, color: "#6b7280" }} />
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button type="primary">Đăng nhập</Button>
          </Link>
        )}
      </div>
    </>
  );
}
export default AccountDropdownComponent;

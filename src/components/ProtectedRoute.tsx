import { Navigate, Outlet } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Spin } from "antd";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useProfile();

  // Đang kiểm tra auth → hiển thị loading toàn màn hình
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang xác thực..." />
      </div>
    );
  }

  // Chưa đăng nhập → redirect sang /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

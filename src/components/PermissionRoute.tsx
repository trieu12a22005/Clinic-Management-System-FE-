import { Navigate, Outlet } from "react-router-dom";
import { useCheckPermission } from "@/hooks/useCheckPermission";
// import { UseAuth } from "@/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useProfile } from "@/hooks/useProfile";

interface PermissionRouteProps {
  /** Danh sách quyền yêu cầu — user cần có ít nhất 1 quyền trong list này */
  requiredPermissions: string[];
  /** Tên tính năng hiển thị trong thông báo lỗi */
  featureName?: string;
  /** Redirect về đâu nếu không đủ quyền (mặc định: /dashboard) */
  redirectTo?: string;
}

/**
 * Bảo vệ route theo permission.
 * Nếu user không có ít nhất 1 trong số requiredPermissions → redirect + toast.
 */
const PermissionRoute = ({
  requiredPermissions,
  featureName = "tính năng này",
  redirectTo = "/dashboard",
}: PermissionRouteProps) => {
  const { data: user } = useProfile();
  const { hasPermission } = useCheckPermission();

  const isAllowed = !!user && hasPermission(requiredPermissions);

  useEffect(() => {
    if (user && !isAllowed) {
      toast.error(`🔒 Bạn không có quyền truy cập ${featureName}. Vui lòng liên hệ quản trị viên để được cấp quyền.`, {
        duration: 5000,
        id: "permission-denied",
      });
    }
  }, [isAllowed, user, featureName]);

  if (!user) return null;
  if (!isAllowed) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
};

export default PermissionRoute;

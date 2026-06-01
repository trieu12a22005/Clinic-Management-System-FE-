import React from "react";
import { useCheckPermission } from "@/hooks/useCheckPermission";

interface HasPermissionProps {
  requiredPermissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component bọc lại các giao diện cần phân quyền.
 * Nếu user có quyền -> Hiển thị children
 * Nếu user KHÔNG có quyền -> Hiển thị fallback (mặc định là ẩn hoàn toàn)
 */
export const HasPermission: React.FC<HasPermissionProps> = ({
  requiredPermissions,
  children,
  fallback = null,
}) => {
  const { hasPermission } = useCheckPermission();

  const isAllowed = hasPermission(requiredPermissions);

  return <>{isAllowed ? children : fallback}</>;
};

export default HasPermission;

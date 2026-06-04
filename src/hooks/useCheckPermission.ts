import { UseAuth } from "@/AuthContext";
import { useCallback } from "react";

/**
 * Hook kiểm tra xem user hiện tại có quyền thực hiện hành động hay không.
 */
export const useCheckPermission = () => {
  const { user } = UseAuth();

  const hasPermission = useCallback(
    (requiredPermissions: string[]) => {
      // Nếu truyền vào mảng rỗng thì ai cũng pass
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      if (!user?.permissions) {
        return false;
      }

      // Kiểm tra xem user có ít nhất 1 quyền trong danh sách yêu cầu không
      return requiredPermissions.some((perm) => user.permissions?.includes(perm));
    },
    [user]
  );

  return { hasPermission };
};

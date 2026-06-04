import { useCallback } from "react";
import { usePermissions } from "./usePermission";

/**
 * Hook kiểm tra xem user hiện tại có quyền thực hiện hành động hay không.
 */
export const useCheckPermission = () => {
  const { data: permissions } = usePermissions();
  const hasPermission = useCallback(
    (requiredPermissions: string[]) => {
      // Nếu truyền vào mảng rỗng thì ai cũng pass
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
      }

      if (!permissions) {
        return false;
      }

      // Kiểm tra xem user có ít nhất 1 quyền trong danh sách yêu cầu không
      return requiredPermissions.some((perm) => permissions?.includes(perm));
    },
    [permissions]
  );

  return { hasPermission };
};

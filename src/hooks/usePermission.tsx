import authApi from "@/apis/auth";
import { query } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const _ = useQuery({
    queryKey: query.permissions,
    queryFn: authApi.getProfile,
    select: (user) => {
      const { permissions } = user;
      return permissions;
    },
  });
  return _;
}

import authApi from "@/apis/auth";
import { query as q, queryClient } from "@/lib/queryClient";
import type { AuthRespone } from "@/types/Auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const selfProfileSelector = (_: AuthRespone) => {
  return {
    firstName: _.firstName,
    lastName: _.lastName,
    birthDate: _.birthDate,
  };
};

export const useProfile = <TResult = AuthRespone>(
  selector?: (data: AuthRespone) => TResult
) => {
  const query = useQuery({
    queryKey: q.profile,
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.user as AuthRespone;
    },
    select: selector,
  });
  return query;
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; password?: string }) => {
      const res = await authApi.updateProfile(data);
      return res.profile;
    },
    onSuccess: (data) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.setQueryData(q.profile, data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Cập nhật thông tin thất bại");
    },
  });
};

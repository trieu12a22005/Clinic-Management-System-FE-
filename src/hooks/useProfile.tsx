import authApi from "@/apis/auth";
import { query as q, queryClient } from "@/lib/queryClient";
import type { AuthRespone } from "@/types/Auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const selfProfileSelector = (_: Partial<AuthRespone>) => {
  return {
    firstName: _.firstName,
    lastName: _.lastName,
    birthDate: _.birthDate,
  };
};

export const selfProfileViewSelector = (_) => {
  return _;
};

export const useProfile = (selector: (_) => any = (_) => _) => {
  const query = useQuery({
    // use q as queryMap
    queryKey: q.profile,
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.user;
    },
    select: selector,
    placeholderData: () => {
      const u = localStorage.getItem("user");
      return u ? u : undefined;
    },
  });
  return query;
};
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const res = await authApi.updateProfile(data);
      return res.profile; // directly point to x.profile
    },
    onSuccess: (data) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.setQueryData(q.profile, data);
    },
    onError: (error) => {
      toast.error(error?.message || "Cập nhật thông tin thất bại");
    },
  });
};

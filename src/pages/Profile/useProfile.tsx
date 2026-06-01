import authApi from "@/apis/auth";
import { queryClient } from "@/lib/queryClient";
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

export const selfProfileViewSelector = (_: Partial<AuthRespone>) => {
  const { firstName, lastName, birthDate, email, role, DisplayID, accountID } = _;
  return {
    firstName,
    lastName,
    birthDate,
    email,
    role,
    DisplayID,
    accountID,
  };
};

export const useProfile = (selector: (_: Partial<AuthRespone>) => any = (_) => _) => {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authApi.getProfile();
      return res.user;
    },
    select: selector,
  });
  return query;
};
export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: Partial<AuthRespone>) => {
      const res = await authApi.updateProfile(data);
      return res.profile; // directly point to x.profile
    },
    onSuccess: (data) => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.setQueryData(["profile"], data);
    },
    onError: (error) => {
      toast.error(error?.message || "Cập nhật thông tin thất bại");
    },
  });
};

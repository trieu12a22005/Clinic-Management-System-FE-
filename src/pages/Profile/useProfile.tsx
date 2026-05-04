import authApi from "@/apis/auth";
import type { AuthRespone } from "@/types/Auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
export const useProfile = () => {
    const query = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await authApi.getProfile();
            return res.user as AuthRespone;
        }
    });
    return {
        profile: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };

}
export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (data: AuthRespone) => {
            return await authApi.updateProfile(data);
        },
        onSuccess: () => {
            toast.success("Cập nhật thông tin thành công");
        },
        onError: (error) => {
            toast.error(error?.message || "Cập nhật thông tin thất bại");
        },
    });
};

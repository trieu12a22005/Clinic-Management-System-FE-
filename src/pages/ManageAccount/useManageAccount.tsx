import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import accountApi from '../../apis/ManageAccount';
import roleApi from '../../apis/role';
import type { RoleRow } from '@/types/role';
import toast from 'react-hot-toast';
export const useManageAccount = () => {
    const queryClient = useQueryClient();
    const queryKey = ['accounts'];

    // Lấy danh sách tài khoản
    const accountsQuery = useQuery({
        queryKey,
        queryFn: accountApi.getAccounts,
    });

    // Tạo tài khoản
    const createAccountMutation = useMutation({
        mutationFn: accountApi.postAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success('Tạo tài khoản thành công!');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi tạo tài khoản.');
        }
    });

    // Cập nhật tài khoản
    const updateAccountMutation = useMutation({
        mutationFn: ({ id, data }: { id: string | number, data: any }) => accountApi.updateAccount(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success('Cập nhật tài khoản thành công!');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi cập nhật tài khoản.');
        }
    });

    // Xóa tài khoản
    const deleteAccountMutation = useMutation({
        mutationFn: accountApi.deleteAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success('Xóa tài khoản thành công!');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi xóa tài khoản.');
        }
    });

    // Import tài khoản từ danh sách JSON
    const importAccountsMutation = useMutation({
        mutationFn: accountApi.importAccounts,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            toast.success('Nhập tài khoản từ Excel thành công!');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Lỗi khi nhập tài khoản từ Excel.');
        }
    });

    // Lấy danh sách vai trò
    const rolesQuery = useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const res = await roleApi.getRolesList();
            return res as RoleRow[];
        },
    });

    return {
        accountsQuery,
        createAccountMutation,
        updateAccountMutation,
        deleteAccountMutation,
        importAccountsMutation,
        rolesQuery,
    };
};
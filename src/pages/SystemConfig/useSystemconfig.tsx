import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import systemConfigApi from '@/apis/systemConfig';
import medicineApi from '@/apis/medicine';

export const useSystemConfigData = () => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ['system-config'];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => systemConfigApi.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      systemConfigApi.update(key, { value, description }),
    onSuccess: () => {
      toast.success('Cập nhật cấu hình thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Cập nhật thất bại. Vui lòng thử lại.'),
  });

  const upsertMutation = useMutation({
    mutationFn: systemConfigApi.upsert,
    onSuccess: () => {
      toast.success('Thêm cấu hình thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Thêm cấu hình thất bại.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => systemConfigApi.delete(key),
    onSuccess: () => {
      toast.success('Đã xoá cấu hình!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Xoá thất bại.'),
  });

  return {
    query,
    updateMutation,
    upsertMutation,
    deleteMutation,
  };
};

export const useMedicineUnitData = () => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ['medicineUnits'];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => medicineApi.getMedicineUnits(),
  });

  const addMutation = useMutation({
    mutationFn: (unitName: string) => medicineApi.createMedicineUnit({ unitName }),
    onSuccess: () => {
      toast.success('Thêm đơn vị thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Thêm đơn vị thất bại.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicineApi.deleteMedicineUnit(id),
    onSuccess: () => {
      toast.success('Đã xoá đơn vị!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Xoá thất bại. Đơn vị này có thể đang được sử dụng.'),
  });

  return {
    query,
    addMutation,
    deleteMutation,
  };
};

export const useMedicineUsageData = () => {
  const queryClient = useQueryClient();
  const QUERY_KEY = ['medicineUsages'];

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => medicineApi.getMedicineUsages(),
  });

  const addMutation = useMutation({
    mutationFn: (usage: string) => medicineApi.createMedicineUsage({ usage }),
    onSuccess: () => {
      toast.success('Thêm cách dùng thành công!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Thêm cách dùng thất bại.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicineApi.deleteMedicineUsage(id),
    onSuccess: () => {
      toast.success('Đã xoá cách dùng!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast.error('Xoá thất bại. Cách dùng này có thể đang được sử dụng.'),
  });

  return {
    query,
    addMutation,
    deleteMutation,
  };
};

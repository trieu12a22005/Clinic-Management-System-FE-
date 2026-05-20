import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import medicineApi from '../../../apis/medicine';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUnitModal = ({ isOpen, onClose }: AddUnitModalProps) => {
  const [unitName, setUnitName] = useState('');
  const queryClient = useQueryClient();

  const addUnitMutation = useMutation({
    mutationFn: () => medicineApi.createMedicineUnit({ unitName: unitName.trim() }),
    onSuccess: () => {
      toast.success('Thêm đơn vị mới thành công!');
      queryClient.invalidateQueries({ queryKey: ['medicineUnits'] });
      setUnitName('');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi thêm đơn vị');
    },
  });

  const handleSubmit = () => {
    if (!unitName.trim()) {
      toast.error('Vui lòng nhập tên đơn vị');
      return;
    }
    addUnitMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Thêm đơn vị thuốc mới</h3>
          <button
            onClick={onClose}
            disabled={addUnitMutation.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Tên đơn vị <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            placeholder="Ví dụ: Lọ, Hộp, Vỉ..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={addUnitMutation.isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={addUnitMutation.isPending || !unitName.trim()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {addUnitMutation.isPending ? 'Đang thêm...' : 'Thêm đơn vị'}
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import type { MedicineItem, MedicineUnit, UpdateMedicineItemPayload } from '../../../apis/medicine';
import { useQuery } from '@tanstack/react-query';
import medicineApi from '../../../apis/medicine';

interface EditMedicineModalProps {
  medicine: MedicineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateMedicineItemPayload) => void;
  isLoading?: boolean;
}



export const EditMedicineModal = ({
  medicine,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: EditMedicineModalProps) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    unit: '' as MedicineUnit,
    price: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (medicine) {
      setFormData({
        medicineName: medicine.medicineName || '',
        unit: (typeof medicine.unit === 'object' && medicine.unit !== null ? (medicine.unit as any).unitID : medicine.unit) as MedicineUnit,
        price: medicine.price?.toString() || '',
        description: medicine.description || '',
      });
      setPreviewImage(medicine.medicineImage || null);
      setImage(null);
      setErrors({});
    }
  }, [medicine]);

  const { data: unitsResponse } = useQuery({
    queryKey: ['medicineUnits'],
    queryFn: () => medicineApi.getMedicineUnits(),
  });
  const units = unitsResponse?.data || [];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Vui lòng nhập tên thuốc';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !medicine) return;

    const payload: UpdateMedicineItemPayload = {};

    if (formData.medicineName !== medicine.medicineName) {
      payload.medicineName = formData.medicineName;
    }
    const originalUnit = typeof medicine.unit === 'object' && medicine.unit !== null ? (medicine.unit as any).unitID : medicine.unit;
    if (String(formData.unit) !== String(originalUnit)) {
      payload.unitID = Number(formData.unit);
    }
    if (parseFloat(formData.price) !== medicine.price) {
      payload.price = parseFloat(formData.price);
    }
    if (formData.description !== medicine.description) {
      payload.description = formData.description;
    }
    if (image) {
      payload.image = image;
    }

    onSubmit(medicine.medicineID, payload);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thuốc</h3>
            <p className="text-sm text-gray-500">Cập nhật thông tin thuốc #{medicine.medicineID}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tên thuốc <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                  errors.medicineName ? 'border-rose-300' : 'border-gray-300'
                }`}
              />
              {errors.medicineName && <p className="mt-1 text-xs text-rose-500">{errors.medicineName}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Đơn vị <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as MedicineUnit })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Chọn đơn vị</option>
                  {units.map((opt) => (
                    <option key={opt.unitID} value={opt.unitID}>
                      {opt.unitName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Giá (VNĐ) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                    errors.price ? 'border-rose-300' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Hình ảnh</label>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-gray-400 overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="medicine-image"
                  />
                  <label
                    htmlFor="medicine-image"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    {previewImage ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                  </label>
                  {image && <p className="mt-1 text-xs text-gray-500">Đã chọn: {image.name}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                Số lượng hiện tại: <span className="font-semibold text-gray-700">{medicine.quantity}</span>
              </p>
              <p className="text-xs text-gray-500">
                Để thay đổi số lượng, vui lòng sử dụng chức năng Nhập/Xuất thuốc.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang lưu...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineModal;

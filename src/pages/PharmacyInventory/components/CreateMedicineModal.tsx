import { useState } from 'react';
import type { MedicineUnit, CreateManyMedicineItemInput } from '../../../apis/medicine';

interface MedicineRow {
  id: string;
  medicineName: string;
  unit: MedicineUnit;
  price: string;
  description: string;
}

interface CreateMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicines: CreateManyMedicineItemInput[]) => void;
  isLoading?: boolean;
}

const unitOptions: { value: MedicineUnit; label: string }[] = [
  { value: 'bottle', label: 'Chai' },
  { value: 'capsule', label: 'Viên' },
  { value: 'patches', label: 'Miếng' },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

const emptyRow = (): MedicineRow => ({
  id: generateId(),
  medicineName: '',
  unit: 'capsule',
  price: '',
  description: '',
});

export const CreateMedicineModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateMedicineModalProps) => {
  const [rows, setRows] = useState<MedicineRow[]>([emptyRow()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addRow = () => {
    setRows([...rows, emptyRow()]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof MedicineRow, value: string) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    rows.forEach((row, index) => {
      if (!row.medicineName.trim()) {
        newErrors[`${row.id}-name`] = 'Vui lòng nhập tên thuốc';
        hasError = true;
      }
      if (!row.price || parseFloat(row.price) <= 0) {
        newErrors[`${row.id}-price`] = 'Giá phải lớn hơn 0';
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const medicines: CreateManyMedicineItemInput[] = rows
      .filter((row) => row.medicineName.trim())
      .map((row) => ({
        medicineName: row.medicineName.trim(),
        unit: row.unit,
        price: parseFloat(row.price),
        description: row.description.trim() || undefined,
      }));

    onSubmit(medicines);
  };

  const handleClose = () => {
    if (!isLoading) {
      setRows([emptyRow()]);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tạo thuốc mới</h3>
            <p className="text-sm text-gray-500">Thêm nhiều thuốc mới vào kho</p>
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

        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={row.id}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Thuốc #{index + 1}
                  </span>
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-rose-500 hover:bg-rose-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Tên thuốc <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={row.medicineName}
                      onChange={(e) => updateRow(row.id, 'medicineName', e.target.value)}
                      placeholder="Ví dụ: Paracetamol 500mg"
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                        errors[`${row.id}-name`] ? 'border-rose-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`${row.id}-name`] && (
                      <p className="mt-1 text-xs text-rose-500">{errors[`${row.id}-name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Đơn vị <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={row.unit}
                      onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      {unitOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
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
                      value={row.price}
                      onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                        errors[`${row.id}-price`] ? 'border-rose-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`${row.id}-price`] && (
                      <p className="mt-1 text-xs text-rose-500">{errors[`${row.id}-price`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateRow(row.id, 'description', e.target.value)}
                      placeholder="Mô tả ngắn về thuốc"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm thuốc khác
          </button>
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
            disabled={isLoading || rows.every((r) => !r.medicineName.trim())}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang tạo...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Tạo {rows.filter((r) => r.medicineName.trim()).length} thuốc
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMedicineModal;

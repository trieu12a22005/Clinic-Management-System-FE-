import { useState, useEffect } from 'react';
import type { MedicineItem, ImexType } from '../../../apis/medicine';
import type { ImexDetail } from '../../../apis/medicineImex';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: ImexType, items: ImexDetail[], note?: string) => void;
  medicines: MedicineItem[];
  preselectedMedicine?: MedicineItem | null;
  mode?: 'import' | 'export' | 'both';
  isLoading?: boolean;
}

interface ItemRow {
  id: string;
  medicineID: number | '';
  quantity: string;
  note: string;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const emptyRow = (): ItemRow => ({
  id: generateId(),
  medicineID: '',
  quantity: '',
  note: '',
});

export const ImportExportModal = ({
  isOpen,
  onClose,
  onSubmit,
  medicines,
  preselectedMedicine,
  mode = 'both',
  isLoading = false,
}: ImportExportModalProps) => {
  const [imexType, setImexType] = useState<ImexType>('import');
  const [rows, setRows] = useState<ItemRow[]>([emptyRow()]);
  const [generalNote, setGeneralNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (preselectedMedicine) {
        setRows([
          {
            id: generateId(),
            medicineID: preselectedMedicine.medicineID,
            quantity: '',
            note: '',
          },
        ]);
      } else {
        setRows([emptyRow()]);
      }
      setErrors({});
      setGeneralNote('');
      if (mode === 'import') setImexType('import');
      if (mode === 'export') setImexType('export');
    }
  }, [isOpen, preselectedMedicine, mode]);

  const addRow = () => {
    setRows([...rows, emptyRow()]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof ItemRow, value: string | number) => {
    setRows(
      rows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
    // Clear error when user updates
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const getMedicineById = (id: number | string) => {
    return medicines.find((m) => m.medicineID === Number(id));
  };

  const calculateTotalValue = (): number => {
    return rows.reduce((total, row) => {
      if (!row.medicineID || !row.quantity) return total;
      const medicine = getMedicineById(row.medicineID);
      if (!medicine) return total;
      return total + medicine.price * parseInt(row.quantity);
    }, 0);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    rows.forEach((row) => {
      if (!row.medicineID) {
        newErrors[`${row.id}-medicine`] = 'Vui lòng chọn thuốc';
        hasError = true;
      }
      if (!row.quantity || parseInt(row.quantity) <= 0) {
        newErrors[`${row.id}-quantity`] = 'Số lượng phải lớn hơn 0';
        hasError = true;
      }
      if (imexType === 'export' && row.medicineID) {
        const medicine = getMedicineById(row.medicineID);
        if (medicine && parseInt(row.quantity) > medicine.quantity) {
          const unitName = typeof medicine.unit === 'object' && medicine.unit !== null ? (medicine.unit as any).unitName : medicine.unit;
          newErrors[`${row.id}-quantity`] = `Chỉ còn ${medicine.quantity} ${unitName} trong kho`;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const items: ImexDetail[] = rows
      .filter((row) => row.medicineID)
      .map((row) => ({
        medicineID: Number(row.medicineID),
        quantity: parseInt(row.quantity),
        note: row.note.trim() || null,
      }));

    onSubmit(imexType, items, generalNote.trim() || undefined);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalValue = calculateTotalValue();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {imexType === 'import' ? 'Nhập thuốc vào kho' : 'Xuất thuốc từ kho'}
            </h3>
            <p className="text-sm text-gray-500">
              {imexType === 'import'
                ? 'Thêm thuốc vào kho từ nhà cung cấp'
                : 'Xuất thuốc từ kho để sử dụng'}
            </p>
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
          {mode === 'both' && (
            <div className="mb-6 flex gap-2 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setImexType('import')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
                  imexType === 'import'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 17h16" />
                </svg>
                Nhập thuốc
              </button>
              <button
                onClick={() => setImexType('export')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
                  imexType === 'export'
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V8m0 0l-4 4m4-4l4 4M4 7h16" />
                </svg>
                Xuất thuốc
              </button>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Ghi chú chung</label>
            <input
              type="text"
              value={generalNote}
              onChange={(e) => setGeneralNote(e.target.value)}
              placeholder={`Lý do ${imexType === 'import' ? 'nhập' : 'xuất'} thuốc...`}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {rows.map((row, index) => {
              const selectedMedicine = row.medicineID ? getMedicineById(row.medicineID) : null;
              const rowTotal = selectedMedicine && row.quantity
                ? selectedMedicine.price * parseInt(row.quantity)
                : 0;

              return (
                <div
                  key={row.id}
                  className={`rounded-xl border p-4 ${
                    imexType === 'import' ? 'border-emerald-100 bg-emerald-50/30' : 'border-amber-100 bg-amber-50/30'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      imexType === 'import' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {imexType === 'import' ? 'Nhập' : 'Xuất'} mục #{index + 1}
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

                  <div className="grid gap-3 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Thuốc <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={row.medicineID}
                        onChange={(e) => updateRow(row.id, 'medicineID', e.target.value)}
                        className={`w-full rounded-lg border px-2 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                          errors[`${row.id}-medicine`] ? 'border-rose-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Chọn thuốc...</option>
                        {medicines.map((med) => (
                          <option key={med.medicineID} value={med.medicineID}>
                            {med.medicineName} ({typeof med.unit === 'object' && med.unit !== null ? (med.unit as any).unitName : med.unit}) - Còn: {med.quantity}
                          </option>
                        ))}
                      </select>
                      {errors[`${row.id}-medicine`] && (
                        <p className="mt-1 text-xs text-rose-500">{errors[`${row.id}-medicine`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Số lượng <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                        min="1"
                        className={`w-full rounded-lg border px-2 py-2 text-sm focus:border-blue-500 focus:outline-none ${
                          errors[`${row.id}-quantity`] ? 'border-rose-300' : 'border-gray-300'
                        }`}
                      />
                      {errors[`${row.id}-quantity`] && (
                        <p className="mt-1 text-xs text-rose-500">{errors[`${row.id}-quantity`]}</p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label className="mb-1 block text-xs font-medium text-gray-700">Ghi chú</label>
                      <input
                        type="text"
                        value={row.note}
                        onChange={(e) => updateRow(row.id, 'note', e.target.value)}
                        placeholder="Lưu ý..."
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-500">Thành tiền</label>
                      <p className="py-2 text-sm font-medium text-gray-700">
                        {rowTotal.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addRow}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Thêm mục {imexType === 'import' ? 'nhập' : 'xuất'}
          </button>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng số mục:</span>
              <span className="font-medium text-gray-900">{rows.filter((r) => r.medicineID).length}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Tổng giá trị:</span>
              <span className={`text-lg font-bold ${
                imexType === 'import' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {totalValue.toLocaleString('vi-VN')} đ
              </span>
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
            disabled={isLoading || rows.every((r) => !r.medicineID)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${
              imexType === 'import'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {imexType === 'import' ? 'Nhập thuốc' : 'Xuất thuốc'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;

import type { MedicineItem } from '../../../apis/medicine';

export type MedicineStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface MedicineTableProps {
  medicines: MedicineItem[];
  onEdit: (medicine: MedicineItem) => void;
  onDelete: (medicine: MedicineItem) => void;
  onImport: (medicine: MedicineItem) => void;
  onExport: (medicine: MedicineItem) => void;
  minStock?: number;
}

const getMedicineStatus = (quantity: number, minStock: number): MedicineStatus => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity < minStock) return 'low-stock';
  return 'in-stock';
};

const statusStyles: Record<MedicineStatus, { label: string; className: string }> = {
  'in-stock': {
    label: 'Còn hàng',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  'low-stock': {
    label: 'Sắp hết',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  'out-of-stock': {
    label: 'Hết hàng',
    className: 'bg-rose-50 text-rose-600 border-rose-200',
  },
};

const unitLabels: Record<string, string> = {
  bottle: 'Chai',
  capsule: 'Viên',
  patches: 'Miếng',
};

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

export const MedicineTable = ({
  medicines,
  onEdit,
  onDelete,
  onImport,
  onExport,
  minStock = 100,
}: MedicineTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Tên thuốc</th>
            <th className="px-4 py-3">Đơn vị</th>
            <th className="px-4 py-3 text-right">Đơn giá</th>
            <th className="px-4 py-3 text-right">Số lượng</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {medicines.map((medicine) => {
            const status = getMedicineStatus(medicine.quantity, minStock);
            const statusStyle = statusStyles[status];

            return (
              <tr key={medicine.medicineID} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {medicine.medicineImage ? (
                      <img
                        src={medicine.medicineImage}
                        alt={medicine.medicineName}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 8c0-2.2 1.8-4 4-4h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{medicine.medicineName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{unitLabels[medicine.unit] || medicine.unit}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatNumber(medicine.price)} đ
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-semibold ${
                      status === 'low-stock'
                        ? 'text-amber-600'
                        : status === 'out-of-stock'
                          ? 'text-rose-600'
                          : 'text-gray-900'
                    }`}
                  >
                    {formatNumber(medicine.quantity)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle.className}`}
                  >
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onImport(medicine)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50"
                      title="Nhập thuốc"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v12m0 0l-4-4m4 4l4-4M4 17h16"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onExport(medicine)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                      title="Xuất thuốc"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20V8m0 0l-4 4m4-4l4 4M4 7h16"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEdit(medicine)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
                      title="Chỉnh sửa"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(medicine)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50"
                      title="Xóa"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {medicines.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-12 w-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p>Chưa có thuốc nào trong kho</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineTable;

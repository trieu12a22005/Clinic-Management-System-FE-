interface StockCheckResult {
  medicineID: number;
  medicineName: string;
  medicineImage?: string | null;
  requiredQty: number;
  availableStock: number;
  isSufficient: boolean;
  unit: string;
  unitVN: string;
  usage: string;
  price: number;
}

interface ConfirmDispenseModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  prescriptionId: string;
  stockChecks: StockCheckResult[];
  isPending: boolean;
}

const ConfirmDispenseModal = ({
  open,
  onClose,
  onConfirm,
  prescriptionId,
  stockChecks,
  isPending,
}: ConfirmDispenseModalProps) => {
  if (!open) {
    return null;
  }

  const totalMedicines = stockChecks.length;
  const totalUnits = stockChecks.reduce((sum, check) => sum + check.requiredQty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Xác nhận phát thuốc</h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          Bạn có chắc chắn muốn xác nhận phát thuốc cho đơn{' '}
          <span className="font-semibold text-gray-800">#{prescriptionId}</span>?
        </p>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">
            Tổng số thuốc: {totalMedicines} loại ({totalUnits} {totalUnits > 1 ? 'đơn vị' : 'đơn vị'})
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {stockChecks.map((check) => (
              <li key={check.medicineID} className="flex justify-between">
                <span className="truncate">• {check.medicineName}</span>
                <span className="ml-2 font-medium">
                  {check.requiredQty} {check.unitVN}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isPending && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isPending ? 'Đang xử lý...' : 'Xác nhận phát thuốc'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDispenseModal;

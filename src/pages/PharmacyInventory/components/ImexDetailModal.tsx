import { useQuery } from '@tanstack/react-query';
import { getImexById, type ImexLog } from '../../../apis/medicineImex';

interface ImexDetailModalProps {
  imexId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return value.toLocaleString('vi-VN');
};

const getUnitLabel = (unit: string) => {
  const labels: Record<string, string> = {
    bottle: 'Chai',
    capsule: 'Viên',
    patches: 'Miếng',
  };
  return labels[unit] || unit;
};

// Skeleton component for loading state
const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export const ImexDetailModal = ({ imexId, isOpen, onClose }: ImexDetailModalProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['imexDetail', imexId],
    queryFn: async () => {
      if (!imexId) return null;
      const response = await getImexById(imexId);
      return response.data;
    },
    enabled: isOpen && !!imexId,
  });

  const log: ImexLog | null = data || null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Chi tiết phiếu {log?.imexType === 'import' ? 'nhập' : 'xuất'} thuốc
            </h3>
            <p className="text-sm text-gray-500">
              {isLoading ? 'Đang tải...' : log ? `Mã phiếu: ${log.imexID}` : 'Không tìm thấy phiếu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            // Skeleton loading state
            <div className="space-y-6">
              {/* Info cards skeleton - now 3 columns without imexID */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-32" />
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-40" />
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-28" />
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-36" />
                </div>
                <div className="rounded-xl border border-gray-200 p-4 md:col-span-2">
                  <SkeletonBox className="mb-2 h-4 w-24" />
                  <SkeletonBox className="h-6 w-full" />
                </div>
              </div>
              {/* Table skeleton */}
              <div className="rounded-xl border border-gray-200 p-4">
                <SkeletonBox className="mb-4 h-5 w-48" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <SkeletonBox className="h-10 flex-1" />
                      <SkeletonBox className="h-10 w-24" />
                      <SkeletonBox className="h-10 w-24" />
                      <SkeletonBox className="h-10 w-32" />
                      <SkeletonBox className="h-10 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Không thể tải chi tiết</h4>
              <p className="text-sm text-gray-600">Có lỗi xảy ra khi tải thông tin phiếu. Vui lòng thử lại.</p>
            </div>
          ) : log ? (
            <div className="space-y-6">
              {/* General Info - 3 columns, note spans 2 columns */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">Loại phiếu</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        log.imexType === 'import'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {log.imexType === 'import' ? (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 17h16" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V8m0 0l-4 4m4-4l4 4M4 7h16" />
                        </svg>
                      )}
                      {log.imexType === 'import' ? 'Phiếu nhập' : 'Phiếu xuất'}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">Dược sĩ</p>
                  <p className="text-sm font-medium text-gray-900">
                    {log.pharmacist?.name || '-'}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">Thời gian tạo</p>
                  <p className="text-sm text-gray-900">{formatDate(log.createdAt)}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">Tổng giá trị</p>
                  <p
                    className={`text-lg font-bold ${
                      log.imexType === 'import' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {formatNumber(log.value)} đ
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 md:col-span-2">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500">Ghi chú</p>
                  <p className="text-sm text-gray-900">{log.note || '-'}</p>
                </div>
              </div>

              {/* Details Table */}
              <div className="rounded-xl border border-gray-200 p-4">
                <h4 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Chi tiết thuốc ({log.details?.length || 0} mục)
                </h4>

                {log.details && log.details.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-3 py-2">Tên thuốc</th>
                          <th className="px-3 py-2">Đơn vị</th>
                          <th className="px-3 py-2 text-right">Số lượng</th>
                          <th className="px-3 py-2 text-right">Đơn giá</th>
                          <th className="px-3 py-2 text-right">Thành tiền</th>
                          <th className="px-3 py-2 min-w-[200px]">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {log.details.map((detail, index) => {
                          const itemTotal = detail.medicine
                            ? detail.medicine.price * Math.abs(detail.quantity)
                            : 0;
                          return (
                            <tr key={index} className="border-b border-gray-100 last:border-b-0">
                              <td className="px-3 py-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {detail.medicine?.medicineName || `Thuốc #${detail.medicineID}`}
                                  </p>
                                  <p className="text-xs text-gray-500">ID: {detail.medicineID}</p>
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                {detail.medicine ? getUnitLabel(detail.medicine.unit) : '-'}
                              </td>
                              <td className="px-3 py-3 text-right">
                                <span
                                  className={`font-semibold ${
                                    detail.quantity > 0 ? 'text-emerald-600' : 'text-amber-600'
                                  }`}
                                >
                                  {detail.quantity > 0 ? '+' : ''}
                                  {detail.quantity}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right">
                                {detail.medicine ? formatNumber(detail.medicine.price) + ' đ' : '-'}
                              </td>
                              <td className="px-3 py-3 text-right font-medium">
                                {formatNumber(itemTotal)} đ
                              </td>
                              <td className="px-3 py-3 text-gray-500 max-w-xs truncate">{detail.note || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="border-t border-gray-200 bg-gray-50/50">
                        <tr>
                          <td colSpan={4} className="px-3 py-3 text-right font-semibold text-gray-700">
                            Tổng cộng:
                          </td>
                          <td className="px-3 py-3 text-right font-bold text-gray-900">
                            {formatNumber(log.value)} đ
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <svg viewBox="0 0 24 24" className="mb-2 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>Không có chi tiết thuốc</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg viewBox="0 0 24 24" className="mb-4 h-12 w-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600">Không tìm thấy thông tin phiếu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImexDetailModal;

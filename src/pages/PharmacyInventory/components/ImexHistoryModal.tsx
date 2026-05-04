import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getImexLogs, type ImexType, type ImexLogItem } from '../../../apis/medicineImex';
import ImexDetailModal from './ImexDetailModal';

interface ImexHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZE = 10;

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatNumber = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return value.toLocaleString('vi-VN');
};

// Skeleton placeholder component
const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="px-4 py-3">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
    </td>
  </tr>
);

export const ImexHistoryModal = ({ isOpen, onClose }: ImexHistoryModalProps) => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<ImexType | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedImexId, setSelectedImexId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['imexLogs', { page, type: typeFilter, from: dateFrom, to: dateTo }],
    queryFn: async () => {
      const params: Parameters<typeof getImexLogs>[0] = {
        page,
        pageSize: PAGE_SIZE,
      };
      if (typeFilter) params.type = typeFilter;
      if (dateFrom) params.from = new Date(dateFrom).toISOString();
      if (dateTo) params.to = new Date(dateTo + 'T23:59:59').toISOString();

      const response = await getImexLogs(params);
      return response;
    },
    enabled: isOpen,
  });

  const logs = data?.data || [];
  const pagination = data?.pagination;

  const handleResetFilters = () => {
    setTypeFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const handleViewDetail = (imexId: string) => {
    setSelectedImexId(imexId);
    setIsDetailModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lịch sử nhập/xuất thuốc</h3>
              <p className="text-sm text-gray-500">Danh sách các phiếu nhập/xuất thuốc</p>
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

          {/* Filters */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as ImexType | '');
                  setPage(1);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Tất cả loại phiếu</option>
                <option value="import">Phiếu nhập</option>
                <option value="export">Phiếu xuất</option>
              </select>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Từ:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Đến:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {(typeFilter || dateFrom || dateTo) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Đặt lại
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Không thể tải dữ liệu</h4>
                <p className="text-sm text-gray-600">Có lỗi xảy ra khi tải lịch sử. Vui lòng thử lại.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Mã phiếu</th>
                      <th className="px-4 py-3">Loại</th>
                      <th className="px-4 py-3">Dược sĩ</th>
                      <th className="px-4 py-3 text-right">Giá trị</th>
                      <th className="px-4 py-3">Ghi chú</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {isLoading ? (
                      // Skeleton loading
                      Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    ) : logs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-500">
                            <svg viewBox="0 0 24 24" className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>Chưa có phiếu nhập/xuất nào</p>
                            {(typeFilter || dateFrom || dateTo) && (
                              <button
                                onClick={handleResetFilters}
                                className="mt-2 text-sm text-blue-600 hover:underline"
                              >
                                Xóa bộ lọc
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log: ImexLogItem) => (
                        <tr key={log.imexID} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-gray-600">
                              {log.imexID.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="px-4 py-3">
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
                              {log.imexType === 'import' ? 'Nhập' : 'Xuất'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{log.pharmacist?.name || '-'}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-medium ${log.imexType === 'import' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {formatNumber(log.value)} đ
                            </span>
                          </td>
                          <td className="px-4 py-3 max-w-xs truncate">
                            <span className="text-gray-500">{log.note || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleViewDetail(log.imexID)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-600 transition hover:bg-blue-50"
                              title="Xem chi tiết"
                            >
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-medium">{logs.length}</span> /{' '}
                <span className="font-medium">{pagination.totalItems}</span> phiếu
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, current, and nearby pages
                      if (p === 1 || p === pagination.totalPages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .map((p, index, arr) => (
                      <div key={p} className="flex items-center">
                        {index > 0 && arr[index - 1] !== p - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          disabled={isLoading}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                            page === p
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages || isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <ImexDetailModal
        imexId={selectedImexId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
};

export default ImexHistoryModal;

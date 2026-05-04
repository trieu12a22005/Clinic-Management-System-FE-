import type { MedicineTicket } from '@/apis/medicineTicket';

type TicketStatus = 'pending' | 'done';
type DisplayStatus = 'waiting' | 'dispensed';

const statusMap: Record<TicketStatus, DisplayStatus> = {
  pending: 'waiting',
  done: 'dispensed',
};

const statusStyles: Record<DisplayStatus, { label: string; className: string }> = {
  waiting: {
    label: 'Đang chờ',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  dispensed: {
    label: 'Đã phát',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
};

interface QueueTableProps {
  items: MedicineTicket[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | DisplayStatus;
  onStatusFilterChange: (value: 'all' | DisplayStatus) => void;
  onViewPrescription: (prescriptionID: string, ticketID: string) => void;
  onUpdateStatus?: (ticketID: string, status: TicketStatus) => void;
}

const QueueTable = ({
  items,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onViewPrescription,
  onUpdateStatus,
}: QueueTableProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Danh sách hàng đợi</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Tìm kiếm..."
              className="w-56 rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.3-4.3" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as 'all' | DisplayStatus)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="waiting">Đang chờ</option>
            <option value="dispensed">Đã phát</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase text-gray-400">
            <tr>
              <th className="px-3 py-3">Số thứ tự</th>
              <th className="px-3 py-3">Mã đơn thuốc</th>
              <th className="px-3 py-3">Tên bệnh nhân</th>
              <th className="px-3 py-3">Phòng dược</th>
              <th className="px-3 py-3">Thời gian tạo</th>
              <th className="px-3 py-3">Trạng thái</th>
              <th className="px-3 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {items.map((item) => {
              const displayStatus = statusMap[item.status];
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '--';
              return (
                <tr key={item.prescriptionDisplayID} className="border-t border-gray-100">
                  <td className="px-3 py-4 font-semibold text-blue-600">
                    {String(item.orderNum).padStart(3, '0')}
                  </td>
                  <td className="px-3 py-4 font-medium text-gray-800">{item.prescriptionDisplayID}</td>
                  <td className="px-3 py-4 text-gray-600">{item.patientName}</td>
                  <td className="px-3 py-4 text-gray-600">{item.roomName}</td>
                  <td className="px-3 py-4 text-gray-600">{formattedDate}</td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${
                        statusStyles[displayStatus].className
                      }`}
                    >
                      {statusStyles[displayStatus].label}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onViewPrescription(item.prescriptionID, item.ticketID)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:text-blue-600"
                        title="Xem chi tiết"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      {item.status === 'pending' && onUpdateStatus && (
                        <button
                          onClick={() => onUpdateStatus(item.prescriptionDisplayID, 'done')}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-emerald-200 hover:text-emerald-600"
                          title="Đánh dấu đã phát"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                            <circle cx="12" cy="12" r="9" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueTable;

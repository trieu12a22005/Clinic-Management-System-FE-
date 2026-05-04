interface QueueSummaryProps {
  waitingCount: number;
  dispensedCount: number;
  totalCount: number;
}

const QueueSummary = ({ waitingCount, dispensedCount, totalCount }: QueueSummaryProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-[#fff7e6] via-white to-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-600">{waitingCount}</p>
            <p className="text-sm font-semibold text-amber-600">Đang chờ</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-[#e8fff4] via-white to-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{dispensedCount}</p>
            <p className="text-sm font-semibold text-emerald-600">Đã phát</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#e9f2ff] via-white to-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 22c0-4 3.582-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
            <p className="text-sm font-semibold text-blue-600">Tổng hôm nay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueSummary;

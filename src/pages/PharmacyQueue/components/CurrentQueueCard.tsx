import type { MedicineTicket } from '@/apis/medicineTicket';

interface CurrentQueueCardProps {
  currentItem: MedicineTicket;
  onViewPrescription: (prescriptionID: string, ticketID: string) => void;
}

const CurrentQueueCard = ({ currentItem, onViewPrescription }: CurrentQueueCardProps) => {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-24 flex-col items-center justify-center rounded-2xl bg-[#1867c0] text-white">
            <span className="text-xs uppercase tracking-wide">Số hiện tại</span>
            <span className="text-2xl font-bold">{String(currentItem.orderNum).padStart(3, '0')}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{currentItem.patientName}</h3>
            <p className="text-sm text-gray-500">Mã đơn thuốc: {currentItem.prescriptionDisplayID}</p>
            <p className="text-sm text-gray-500">Phòng: {currentItem.roomName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-800">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21H7a2 2 0 01-2-2v-2a7 7 0 0114 0v2a2 2 0 01-2 2z" />
            </svg>
            Gọi số
          </button>
          <button
            onClick={() => onViewPrescription(currentItem.prescriptionID, currentItem.ticketID)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-blue-200 hover:text-blue-600"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Xem đơn
          </button>
          <button
            onClick={() => onViewPrescription(currentItem.prescriptionID, currentItem.ticketID)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1867c0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Xác nhận phát thuốc
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentQueueCard;

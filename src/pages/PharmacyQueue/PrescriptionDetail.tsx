import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import prescriptionService from '@/apis/prescription';
import { dispenseMedicine } from '@/apis/medicineTicket';
import ConfirmDispenseModal from './components/ConfirmDispenseModal';
import type { PrescriptionDetail as PrescriptionDetailType } from '@/apis/prescription';

// Helper function to translate unit to Vietnamese
const translateUnit = (unit: any): string => {
  if (!unit) return '';
  const unitStr = typeof unit === 'object' ? unit.unitName : String(unit);
  if (!unitStr) return '';
  const unitMap: Record<string, string> = {
    'bottle': 'chai',
    'capsule': 'viên',
    'patches': 'miếng',
  };
  return unitMap[unitStr.toLowerCase()] || unitStr;
};

interface StockCheckResult {
  medicineID: number;
  medicineName: string;
  medicineImage?: string | null;
  requiredQty: number; // Quantity needed for this prescription
  availableStock: number; // Total available stock
  isSufficient: boolean;
  unit: string;
  unitVN: string;
  usage: string;
  price: number;
}

const PrescriptionDetail = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId') || '';
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch prescription details (includes medicine info with stock)
  const { data: prescriptionData, isLoading } = useQuery({
    queryKey: ['prescription', prescriptionId],
    queryFn: async () => {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      const response = await prescriptionService.getPrescription(prescriptionId);
      return response.prescription;
    },
    enabled: !!prescriptionId,
  });

  // Build stock check results from prescription details
  const stockChecks: StockCheckResult[] = prescriptionData?.details.map((detail: PrescriptionDetailType) => {
    const medicine = detail.medicine;
    const requiredQty = detail.quantity;
    const availableStock = medicine.quantity || 0;
    
    return {
      medicineID: medicine.medicineID,
      medicineName: medicine.medicineName,
      medicineImage: medicine.medicineImage,
      requiredQty,
      availableStock,
      isSufficient: availableStock >= requiredQty,
      unit: typeof medicine.unit === 'object' && medicine.unit !== null ? (medicine.unit as any).unitName : medicine.unit,
      unitVN: translateUnit(medicine.unit),
      usage: detail.usage,
      price: Number(medicine.price) || 0,
    };
  }) || [];

  // Check if all medicines have sufficient stock
  const allStockSufficient = stockChecks.length > 0 && stockChecks.every(check => check.isSufficient);

  // Dispense mutation
  const dispenseMutation = useMutation({
    mutationFn: async () => {
      if (!prescriptionId) throw new Error('Prescription ID is required');
      if (!ticketId) throw new Error('Ticket ID is required');
      return dispenseMedicine(ticketId);
    },
    onSuccess: () => {
      toast.success('Phát thuốc thành công!');
      queryClient.invalidateQueries({ queryKey: ['prescription', prescriptionId] });
      queryClient.invalidateQueries({ queryKey: ['medicine-tickets'] });
      setConfirmOpen(false);
      setTimeout(() => {
        navigate('/pharmacy-queue');
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi phát thuốc');
    },
  });

  const handleConfirmDispense = () => {
    if (!allStockSufficient) {
      toast.error('Không đủ tồn kho để phát thuốc');
      return;
    }
    if (!ticketId) {
      toast.error('Ticket ID không hợp lệ');
      return;
    }
    dispenseMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Đang tải thông tin đơn thuốc...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!prescriptionData) {
    return (
      <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">Không tìm thấy đơn thuốc</p>
            <button
              onClick={() => navigate('/pharmacy-queue')}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Quay lại hàng đợi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pharmacy-queue')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đơn thuốc #{prescriptionData.prescriptionDisplayID}</h1>
            <p className="text-sm text-gray-500">Chi tiết đơn thuốc và kiểm tra tồn kho</p>
          </div>
        </div>

        {/* Prescription Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 16h6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </span>
            Thông tin đơn thuốc
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400">Mã đơn thuốc</p>
              <p className="font-semibold">{prescriptionData.prescriptionID}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Ngày tạo</p>
              <p className="font-semibold">
                {new Date(prescriptionData.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Số ngày điều trị</p>
              <p className="font-semibold">{prescriptionData.totalTreatmentDays} ngày</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Cần tái khám</p>
              <p className="font-semibold">{prescriptionData.needReExamine ? 'Có' : 'Không'}</p>
            </div>
          </div>
          {prescriptionData.note && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-400">Ghi chú</p>
              <p className="text-sm text-gray-700">{prescriptionData.note}</p>
            </div>
          )}
        </div>

        {/* Medication List with Stock Check */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </span>
            Danh sách thuốc ({stockChecks.length})
          </div>

          {stockChecks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
              Không có thuốc nào trong đơn
            </div>
          ) : (
            <div className="space-y-3">
              {stockChecks.map((check) => (
                <div
                  key={check.medicineID}
                  className={`rounded-xl border p-4 ${
                    check.isSufficient
                      ? 'border-gray-200 bg-white'
                      : 'border-red-300 bg-red-50'
                  }`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-1 gap-3">
                      {/* Medicine Image */}
                      {check.medicineImage ? (
                        <img
                          src={check.medicineImage}
                          alt={check.medicineName}
                          className="h-16 w-16 flex-shrink-0 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{check.medicineName}</h3>
                          {!check.isSufficient && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                              Thiếu thuốc
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{check.usage}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Đơn giá: {check.price.toLocaleString('vi-VN')}đ / {check.unitVN}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Yêu cầu</p>
                        <p className="font-semibold text-gray-700">
                          {check.requiredQty} {check.unitVN}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Tồn kho</p>
                        <p className={`font-semibold ${check.isSufficient ? 'text-green-600' : 'text-red-600'}`}>
                          {check.availableStock} {check.unitVN}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!check.isSufficient && (
                    <div className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
                      <span className="font-medium">Cảnh báo:</span> Tồn kho không đủ. Cần thêm{' '}
                      {check.requiredQty - check.availableStock} {check.unitVN} nữa.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stock Status Summary */}
          {stockChecks.length > 0 && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái tồn kho:</span>
                {allStockSufficient ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đủ tồn kho để phát thuốc
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-medium text-red-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Thiếu thuốc - Không thể phát
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={() => navigate('/pharmacy-queue')}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
          >
            Quay lại
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!allStockSufficient || dispenseMutation.isPending || !ticketId}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              allStockSufficient && !dispenseMutation.isPending && ticketId
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            {dispenseMutation.isPending ? 'Đang xử lý...' : 'Xác nhận phát thuốc'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDispenseModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDispense}
        prescriptionId={prescriptionData.prescriptionID}
        stockChecks={stockChecks}
        isPending={dispenseMutation.isPending}
      />
    </div>
  );
};

export default PrescriptionDetail;

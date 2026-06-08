import React from 'react';
import type { ReceiptData } from '@/apis/receipt';

interface PharmacyReceiptTemplateProps {
  data: ReceiptData | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const PharmacyReceiptTemplate = React.forwardRef<HTMLDivElement, PharmacyReceiptTemplateProps>(
  ({ data }, ref) => {
    if (!data) return null;

    const medicines = data.medicines ?? [];
    const medicineTotal = medicines.reduce(
      (total, medicine) => total + medicine.price * medicine.quantity,
      0
    );

    return (
      <div
        ref={ref}
        className="mx-auto max-w-[900px] border border-gray-300 bg-white p-8 font-sans text-gray-800"
        style={{ contentVisibility: 'auto' }}
      >
        {/* Header - same base receipt information as Appointment receipt */}
        <div className="mb-6 border-b-2 border-gray-900 pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-gray-900">
            PHÒNG KHÁM ĐA KHOA QUỐC TẾ
          </h1>
          <p className="text-xs text-gray-500">
            Địa chỉ: 123 Đường Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh
          </p>
          <p className="text-xs text-gray-500">Điện thoại: (028) 3864 7256</p>
          <h2 className="mt-4 text-lg font-bold uppercase text-gray-800">
            HÓA ĐƠN THANH TOÁN VIỆN PHÍ
          </h2>
          <p className="text-xs italic text-gray-500">
            Mã hóa đơn: {data.appointmentDisplayID}
          </p>
        </div>

        {/* Patient Details */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <span className="font-semibold">Họ và tên:</span> {data.patientName}
            </p>
            <p>
              <span className="font-semibold">Mã bệnh nhân:</span>{' '}
              {data.patientDisplayID ?? '--'}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Ngày khám:</span>{' '}
              {formatDate(data.appointmentDate)}
            </p>
          </div>
        </div>

        {/* Payment summary table - same content as Appointment receipt */}
        <table className="mb-6 w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nội dung thanh toán
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Phí khám bệnh</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                {formatCurrency(data.examineFee)}
              </td>
            </tr>
            {data.prescriptionFee !== null && (
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Phí thuốc / Đơn thuốc (
                  {data.prescriptions
                    .map((p) => p.prescriptionDisplayID || 'Mã đơn thuốc')
                    .join(', ')}
                  )
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  {formatCurrency(data.prescriptionFee)}
                </td>
              </tr>
            )}
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-300 px-4 py-2 text-right">
                Tổng cộng:
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right text-base text-blue-700">
                {formatCurrency(data.totalFee)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Medicine detail table below the normal receipt information */}
        <h3 className="mb-2 text-sm font-bold uppercase text-gray-800">
          Chi tiết thuốc đã phát
        </h3>
        <table className="mb-6 w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left">STT</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Tên thuốc</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Số lượng</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Đơn vị</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Đơn giá</th>
              <th className="border border-gray-300 px-3 py-2 text-right">Thành tiền</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length > 0 ? (
              medicines.map((medicine, index) => (
                <tr key={medicine.medicineID}>
                  <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-3 py-2 font-medium">
                    {medicine.medicineName}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right">
                    {medicine.quantity}
                  </td>
                  <td className="border border-gray-300 border-r-gray-400 px-3 py-2">
                    {medicine.unitName}
                  </td>
                  <td className="border border-gray-300 border-l-gray-400 px-3 py-2 text-right">
                    {formatCurrency(medicine.price)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                    {formatCurrency(medicine.price * medicine.quantity)}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {medicine.description ?? '--'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border border-gray-300 px-3 py-6 text-center text-gray-500">
                  Không có thuốc đủ tồn kho để xuất.
                </td>
              </tr>
            )}
            <tr className="bg-gray-50 font-bold">
              <td colSpan={5} className="border border-gray-300 px-3 py-2 text-right">
                Tổng tiền thuốc:
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right text-blue-700">
                {formatCurrency(data.prescriptionFee ?? medicineTotal)}
              </td>
              <td className="border border-gray-300 px-3 py-2" />
            </tr>
          </tbody>
        </table>

        {/* Signature */}
        <div className="mt-12 flex justify-between text-sm italic">
          <div className="text-center">
            <p>Bệnh nhân</p>
            <p className="mt-16 font-semibold not-italic">{data.patientName}</p>
          </div>
          <div className="text-center">
            <p>
              Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{' '}
              {new Date().getFullYear()}
            </p>
            <p className="font-semibold">Người lập phiếu</p>
            <p className="mt-16 font-semibold not-italic">Nhà thuốc Quốc Tế</p>
          </div>
        </div>
      </div>
    );
  }
);

PharmacyReceiptTemplate.displayName = 'PharmacyReceiptTemplate';

export default PharmacyReceiptTemplate;

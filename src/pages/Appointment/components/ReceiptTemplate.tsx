import React from 'react';
import type { ReceiptData } from '@/apis/receipt';

interface ReceiptTemplateProps {
  data: ReceiptData | null;
}

const ReceiptTemplate = React.forwardRef<HTMLDivElement, ReceiptTemplateProps>(
  ({ data }, ref) => {
    if (!data) return null;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(amount);
    };

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    return (
      <div
        ref={ref}
        className="mx-auto max-w-[800px] border border-gray-300 bg-white p-8 font-sans text-gray-800"
        style={{ contentVisibility: 'auto' }}
      >
        {/* Header */}
        <div className="mb-6 border-b-2 border-gray-900 pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-gray-900">
            PHÒNG KHÁM ĐA KHOA ANTIGRAVITY
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
              <span className="font-semibold">Mã bệnh nhân:</span> {data.patientDisplayID ?? '--'}
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-semibold">Ngày khám:</span>{' '}
              {formatDate(data.appointmentDate)}
            </p>
            {/* <p>
              <span className="font-semibold">Mã lịch hẹn:</span>{' '}
              {data.appointmentDisplayID}
            </p> */}
          </div>
        </div>

        {/* Table of Services */}
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

        {/* Signature */}
        <div className="mt-12 flex justify-between text-sm italic">
          <div className="text-center">
            <p>Bệnh nhân</p>
            <p className="mt-16 not-italic font-semibold">{data.patientName}</p>
          </div>
          <div className="text-center">
            <p>
              Ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm{' '}
              {new Date().getFullYear()}
            </p>
            <p className="font-semibold">Người lập phiếu</p>
            <p className="mt-16 not-italic font-semibold">Nhà thuốc Quốc Tế</p>
          </div>
        </div>
      </div>
    );
  }
);

ReceiptTemplate.displayName = 'ReceiptTemplate';

export default ReceiptTemplate;

import { pdf } from '@react-pdf/renderer';
import { message } from 'antd';
import PrescriptionPdfDocument from '@/components/pdf/PrscriptionPdfDocument';
import type { PrescriptionPdfData } from '@/types/Prescription';
import type { PrescriptionMedicine } from '@/types/Prescription';

type BuildPdfDataParams = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  medicineList: PrescriptionMedicine[];
  /** Tên bệnh để in PDF (thay cho mã bệnh gửi backend) */
  diagnoseText?: string;
};

const getMedicineUsageText = (usages: PrescriptionMedicine['usages']) =>
  usages
    .map((usage, index) => {
      const parts = [
        usage.timeToTake,
        usage.quantity ? `${usage.quantity} viên` : '',
        usage.usage,
      ].filter(Boolean);

      return parts.length ? `${index + 1}. ${parts.join(' - ')}` : '';
    })
    .filter(Boolean)
    .join('; ');

const getMedicineTotalQuantity = (usages: PrescriptionMedicine['usages']) =>
  usages.reduce((sum, usage) => sum + Number(usage.quantity || 0), 0);

export const buildPdfData = ({
  values,
  medicineList,
  diagnoseText,
}: BuildPdfDataParams): PrescriptionPdfData => {
  return {
    name: values.name || '',
    phone: values.phone || '',
    date: values.date ? values.date.format('DD/MM/YYYY') : '',
    gender: values.gender || '',
    address: values.address || '',
    weight: values.weight ? String(values.weight) : '',
    pressure: values.pressure || '',
    type: values.type || '',
    symptom: values.symptom || '',
    diagnose: diagnoseText ?? values.diagnose ?? '',
    note: values.note || '',
    medicines: medicineList.map((item) => ({
      medicineName: item.medicineName,
      quantity: getMedicineTotalQuantity(item.usages),
      usage: getMedicineUsageText(item.usages),
    })),
  };
};

export const exportPrescriptionPdf = async (data: PrescriptionPdfData) => {
  try {
    const blob = await pdf(<PrescriptionPdfDocument data={data} />).toBlob();

    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');

    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = url;

    iframe.onload = () => {
      const frameWindow = iframe.contentWindow;

      if (frameWindow) {
        frameWindow.focus();
        frameWindow.print();
      }

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        iframe.remove();
      }, 2000);
    };

    document.body.appendChild(iframe);
  } catch (error) {
    console.error('Export PDF failed:', error);
    message.error('Mở bản in PDF thất bại. Vui lòng thử lại.');
  }
};
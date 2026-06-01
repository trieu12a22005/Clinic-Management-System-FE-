import type { ColumnsType } from 'antd/es/table';
export type PrescriptionPdfData = {
  name: string;
  phone: string;
  date: string;
  gender: string;
  address: string;
  weight: string;
  pressure: string;
  type: string;
  symptom: string;
  diagnose: string;
  note: string;
  medicines: PrescriptionPdfMedicine[];
};
export type UsageItem = {
  timeToTake?: string;
  quantity?: number;
  usage?: string;
};

export type PrescriptionMedicine = {
  medicineId: number;
  medicineName: string;
  usages: UsageItem[];
  totalTreatmentDays?: number;
};
export type PrescriptionPdfMedicine = {
  medicineName: string;
  quantity: number;
  usage: string;
};

export type TableRow = {
  key: number;
  medicineId: number;
  medicineName: string;
  totalQuantity: number;
  usagesText: string;
  totalTreatmentDays?: number;
};

export type { ColumnsType };
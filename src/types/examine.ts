export interface ExaminePayload {
  enterTicketID: string;
  patientID: string;
  symptoms: string;
  status: string;
  diagnose: string[];
  height?: number;
  weight?: number;
  bloodPressure?: string;
  note?: string;
  treatmentPlan?: string;
}

export interface PrescriptionDetailPayload {
  medicineID: number;
  usage: string;
  quantity?: number;
}

export interface PrescriptionPayload {
  totalTreatmentDays: number;
  needReExamine?: boolean;
  note?: string;
  details: PrescriptionDetailPayload[];
}

export interface PostExamineData {
  examine: ExaminePayload;
  prescription?: PrescriptionPayload;
}

export interface ExamineHistoryItem {
  examineLogID: string;
  examinedAt: string;
  doctorName: string;
  status: "done" | "pending" | "cancelled";
  symptoms: string;
  diagnose: string;
  treatmentPlan: string;
  note?: string;
}
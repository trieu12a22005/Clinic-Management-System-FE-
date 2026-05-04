export interface PostExamineData {
  ticketID?: string;
  appointmentID: string;
  patientID: string;
  symptoms: string;
  status: string;
  treatmentPlan: string;
  diagnose: string[];
  note: string;
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
};
import { useParams } from "react-router-dom";
import { PatientHistory } from "./PatientHistory";
import { usePatientHistory } from "./usePatientHistory";
type ExamineHistoryItem = {
  examineLogID: string;
  examinedAt: string;
  doctorName: string;
  status: "done" | "pending" | "cancelled";
  symptoms: string;
  diagnose: string;
  treatmentPlan: string;
  note?: string;
};
const mockData: ExamineHistoryItem[] = [
  {
    examineLogID: "1",
    examinedAt: "26/03/2026 08:30",
    doctorName: "BS. Nguyễn Văn A",
    status: "done",
    symptoms: "Đau đầu, sốt nhẹ",
    diagnose: "Cảm cúm",
    treatmentPlan: "Uống thuốc 5 ngày, nghỉ ngơi",
    note: "Tái khám nếu sốt kéo dài",
  },
  {
    examineLogID: "2",
    examinedAt: "20/03/2026 14:00",
    doctorName: "BS. Trần Thị B",
    status: "done",
    symptoms: "Ho, đau họng",
    diagnose: "Viêm họng",
    treatmentPlan: "Kháng viêm, súc họng",
    note: "Uống nhiều nước ấm",
  },
];
const HistoryPage = () => {
    const { id } = useParams();
    const data = usePatientHistory("73df2a99-649a-4efd-8081-73508f75b32f");
    console.log(data);
  return <PatientHistory data={mockData} />;
};

export default HistoryPage;
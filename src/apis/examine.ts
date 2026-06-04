import type { PostExamineData } from "@/types/examine";
import { apiClient } from "./axios";

class ExamineApi {
    async postExamination(data: PostExamineData) {
        const response = await apiClient.post('/examine/summary', data);
        return response.data;
    }
    async getPrescriptionFull(patientID: string) {
        const response = await apiClient.get(`/examine/${patientID}/full`);
        return response.data;
    }
    async getPatientLookup(date?: string, keyword?: string) {
        const params = new URLSearchParams();
        if (keyword) {
            params.append("keyword", keyword);
        } else if (date) {
            params.append("date", date);
        }
        const response = await apiClient.get(`/examine/patient-lookup?${params.toString()}`);
        return response.data;
    }
}
const examineApi = new ExamineApi();
export default examineApi;
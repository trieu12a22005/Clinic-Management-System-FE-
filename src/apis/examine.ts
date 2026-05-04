import type { PostExamineData } from "@/types/examine";
import { apiClient } from "./axios";

class ExamineApi {
    async postExamination(data: PostExamineData) {
        const response = await apiClient.post('/examine/new', data);
        return response.data;
    }
    async getPrescriptionFull(patientID: string) {
        const response = await apiClient.get(`/examine/${patientID}/full`);
        return response.data;
    }
}
const examineApi = new ExamineApi();
export default examineApi;
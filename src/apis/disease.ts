import { apiClient } from "./axios";

class DiseaseAPI {
    async getDiseaseByword(word: string) {
        const response = await apiClient.get(`/examine/disease/search?keyword=${word}`);
        return response.data;
    }
    async getDiseases(page: number = 1, limit: number = 1000) {
        const response = await apiClient.get(`/examine/disease?page=${page}&limit=${limit}`);
        return response.data;
    }
    async createDisease(data: { diseaseID: string, diseaseName: string, note?: string }) {
        const response = await apiClient.post(`/examine/disease`, data);
        return response.data;
    }
    async updateDisease(diseaseID: string, data: { diseaseName: string, note?: string }) {
        const response = await apiClient.put(`/examine/disease/${diseaseID}`, data);
        return response.data;
    }
    async deleteDisease(diseaseID: string) {
        const response = await apiClient.delete(`/examine/disease/${diseaseID}`);
        return response.data;
    }
}
const diseaseApi = new DiseaseAPI();
export default diseaseApi;
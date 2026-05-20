import { apiClient } from "./axios";

class DiseaseAPI {
    async getDiseaseByword(word: string) {
        const response = await apiClient.get(`/examine/disease/search?keyword=${word}`);
        return response.data;
    }
}
const diseaseApi = new DiseaseAPI();
export default diseaseApi;
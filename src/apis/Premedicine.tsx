import { apiClient } from './axios';
class MedicineApi {
  async getMedicine(name: string) {
    const response = await apiClient.get(`/medicine/items?search=${name}`);
    return response.data;
  }
}

const medicineApi = new MedicineApi();
export default medicineApi;
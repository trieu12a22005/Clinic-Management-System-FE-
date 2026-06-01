import { apiClient } from './axios';

class ReportApi {
    async getBM1(date: string) {
        const response = await apiClient.get('/admin/report/examination-list', { params: { date } });
        return response.data;
    }
    async getBM3(dateStr?: string, keyword?: string): Promise<BM3Response> {
        let url = `/admin/report/patient-list?`;
        if (keyword) {
            url += `keyword=${encodeURIComponent(keyword)}`;
        } else if (dateStr) {
            url += `date=${dateStr}`;
        }
        const response = await apiClient.get<BM3Response>(url);
        return response.data;
    }
    async getBM5_1(month: number, year: number) {
        const response = await apiClient.get('/admin/report/monthly-revenue', { params: { month, year } });
        return response.data;
    }
}

const reportApi = new ReportApi();
export default reportApi;

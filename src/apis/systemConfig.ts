import { apiClient } from './axios';
import type { SystemConfigItem, UpsertConfigPayload, SystemConfigHistoryItem } from '@/types/systemConfig';

class SystemConfigApi {
    async getAll(): Promise<{ message: string; data: SystemConfigItem[] }> {
        const response = await apiClient.get('/admin/config');
        return response.data;
    }

    async getByKey(key: string): Promise<{ message: string; data: SystemConfigItem }> {
        const response = await apiClient.get(`/admin/config/${key}`);
        return response.data;
    }

    async update(key: string, payload: { value: string; description?: string }): Promise<{ message: string; data: SystemConfigItem }> {
        const response = await apiClient.put(`/admin/config/${key}`, payload);
        return response.data;
    }

    async upsert(payload: UpsertConfigPayload): Promise<{ message: string; data: SystemConfigItem }> {
        const response = await apiClient.post('/admin/config', payload);
        return response.data;
    }

    async delete(key: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/admin/config/${key}`);
        return response.data;
    }

    /** Lấy lịch sử thay đổi của 1 config key */
    async getHistory(key: string, limit = 50): Promise<{ message: string; data: SystemConfigHistoryItem[] }> {
        const response = await apiClient.get(`/admin/config/${key}/history`, { params: { limit } });
        return response.data;
    }

    /** Kiểm tra có thay đổi đang chờ hiệu lực (ngày mai) không */
    async getPending(key: string): Promise<{ message: string; hasPending: boolean; data: SystemConfigHistoryItem | null }> {
        const response = await apiClient.get(`/admin/config/${key}/pending`);
        return response.data;
    }
}

const systemConfigApi = new SystemConfigApi();
export default systemConfigApi;

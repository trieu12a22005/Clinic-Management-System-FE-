export interface SystemConfigItem {
    key: string;
    value: string;
    description: string;
}

export interface SystemConfigResponse {
    message: string;
    data: SystemConfigItem[];
}

export interface UpsertConfigPayload {
    key: string;
    value: string;
    description?: string;
}

/** Một bản ghi lịch sử thay đổi config */
export interface SystemConfigHistoryItem {
    id: number;
    key: string;
    value: string;
    changedAt: string;       // ISO timestamp — thời điểm admin bấm lưu
    effectiveDate: string;   // ISO date string — ngày giá có hiệu lực
    isPending?: boolean;     // true nếu effectiveDate > hôm nay
}

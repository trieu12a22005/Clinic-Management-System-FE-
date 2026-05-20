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

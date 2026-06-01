import reportApi from "@/apis/report";
import type { BM1Response } from "@/types/reportType";
import { useQuery } from "@tanstack/react-query";

export const UseBM1 = (date: string) => {
    const query = useQuery({
        queryKey: ["bm1", date],
        queryFn: async () => {
            const res = await reportApi.getBM1(date);
            return res as BM1Response;
        },
        enabled: !!date,
    });
    return {
        report: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

export const UseBM5_1 = (month: number, year: number) => {
    const query = useQuery({
        queryKey: ["bm5_1", month, year],
        queryFn: async () => {
            const res = await reportApi.getBM5_1(month, year);
            return res;
        },
        enabled: !!month && !!year,
    });
    return {
        report: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

import medicineApi from "@/apis/medicine";

export const UseBM5_2 = (month: number, year: number) => {
    const query = useQuery({
        queryKey: ["bm5_2", month, year],
        queryFn: async () => {
            const from = new Date(year, month - 1, 1).toISOString();
            const to = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
            
            // Lấy phiếu xuất thuốc với số lượng lớn để tổng hợp
            const res = await medicineApi.getImexLogs({ type: "export", from, to, pageSize: 9999 } as any);
            return res;
        },
        enabled: !!month && !!year,
    });

    // Tổng hợp dữ liệu
    let aggregatedData: any[] = [];
    if (query.data?.data) {
        const map = new Map<number, any>();
        query.data.data.forEach((log: any) => {
            if (log.details) {
                log.details.forEach((d: any) => {
                    const medId = d.medicineID;
                    if (!map.has(medId)) {
                        map.set(medId, {
                            medicineID: medId,
                            thuoc: d.medicine.medicineName,
                            donViTinh: d.medicine.unit?.unitName || d.medicine.unit || "Khác",
                            soLuong: 0,
                            soLanDung: 0,
                        });
                    }
                    const existing = map.get(medId);
                    existing.soLuong += Math.abs(d.quantity);
                    existing.soLanDung += 1; // Mỗi phiếu xuất tính là 1 lần xuất dùng
                });
            }
        });
        aggregatedData = Array.from(map.values()).sort((a, b) => b.soLuong - a.soLuong).map((item, index) => ({
            ...item,
            stt: index + 1,
            key: item.medicineID
        }));
    }

    return {
        reportData: aggregatedData,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

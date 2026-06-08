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

export const UseBM5_2 = (month: number, year: number) => {
    const query = useQuery({
        queryKey: ["bm5_2", month, year],
        queryFn: async () => {
            const res = await reportApi.getBM5_2(month, year);
            return res;
        },
        enabled: !!month && !!year,
    });

    return {
        reportData: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

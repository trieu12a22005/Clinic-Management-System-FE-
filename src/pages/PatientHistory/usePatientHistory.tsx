import examineApi from "@/apis/examine";
import type { ExamineHistoryItem } from "@/types/examine";
import { useQuery } from "@tanstack/react-query";

export const usePatientHistory = (id: string) => {
    const query = useQuery({
        queryKey: ['patientHistory', id],
        queryFn: async () => {
            const res = await examineApi.getPrescriptionFull(id);
            return res.data;
        }
    });
    return {
        history: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
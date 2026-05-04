// src/hooks/useTimetable.ts
import timeTableApi from '@/apis/timetable';
import type { TimetableResponse } from '@/types/timetableType';
import { useQuery } from '@tanstack/react-query';
export const useTimetable = (doctorId: string) => {
    const query = useQuery({
        queryKey: ['timetables', doctorId],
        queryFn: async () => {
            const res = await timeTableApi.getTimetable(doctorId);
            return res.timetables as TimetableResponse[];
        },
        enabled: !!doctorId,
    });
    return {
        timetables: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
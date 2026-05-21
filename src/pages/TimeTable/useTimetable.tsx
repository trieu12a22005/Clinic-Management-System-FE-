// src/hooks/useTimetable.ts
import timeTableApi from '@/apis/timetable';
import type { TimetableResponse } from '@/types/timetableType';
import { useQuery } from '@tanstack/react-query';
export const useTimetable = (accountID: string) => {
    const query = useQuery({
        queryKey: ['timetables', accountID],
        queryFn: async () => {
            const res = await timeTableApi.getTimetable(accountID);
            return res.timetables as TimetableResponse[];
        },
        enabled: !!accountID,
    });
    return {
        timetables: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
export const useAllTimetable = () => {
    const query = useQuery({
        queryKey: ['allTimetables'],
        queryFn: async () => {
            const res = await timeTableApi.getAllTimetable();
            return res.timetables as TimetableResponse[];
        },
    });
    return {
        timetables: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};

export const useTimetableByDay = (accountID: string, dayOfWeek: string) => {
    const query = useQuery({
        queryKey: ['timetables', accountID, dayOfWeek],
        queryFn: async () => {
            const res = await timeTableApi.getTimetableByDay(accountID, dayOfWeek);
            return res.timetables as TimetableResponse[];
        },
        enabled: !!accountID && !!dayOfWeek,
    });
    return {
        timetables: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};


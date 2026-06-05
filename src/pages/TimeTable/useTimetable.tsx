// src/hooks/useTimetable.ts
import timeTableApi from '@/apis/timetable';
import { useQuery } from '@tanstack/react-query';
export const useTimetable = (accountID: string) => {
    const query = useQuery({
        queryKey: ['timetables', accountID],
        queryFn: async () => {
            const res = await timeTableApi.getTimetableByDoctor(accountID);
            return res.timetables;
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
            const res = await timeTableApi.getAllTimetables();
            const flattened = Object.values(res.timetables).flat();
            return flattened;
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
            return res.timetables;
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


import roomApi from '@/apis/room';
import type { RoomOption } from '@/apis/room';
import { useQuery } from '@tanstack/react-query';

const RoomService = () => {
    const query = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await roomApi.getRooms();
            return res as RoomOption[];
        }
    });
    return {
        rooms: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
};
export default RoomService;

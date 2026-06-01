import ticketApi from "@/apis/ticket";
import type { EnterTicketParams } from "@/types/EnterTicket";
import { useQuery } from "@tanstack/react-query";
import { mapEnterTicketRows } from "./component/enterTicketmapper";

export const UseExamination = (params: EnterTicketParams) => {
    const query = useQuery({
        queryKey: ['examinations', params],
        queryFn: async () => {
            const res = await ticketApi.getTicket(params);
            return mapEnterTicketRows(res.data);
        },
        enabled: !!params.roomID,
        staleTime: 0, // Ghi đè cấu hình 5 phút của global để luôn lấy dữ liệu mới nhất
    });
    return {
        examinations: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
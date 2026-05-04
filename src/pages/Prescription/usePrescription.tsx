import examineApi from "@/apis/examine";
import prescriptionApi from "@/apis/Premedicine";
import ticketApi from "@/apis/ticket";
import type { PostExamineData } from "@/types/examine";
import type { Medicine } from "@/types/medicine";
import { useMutation, useQuery } from "@tanstack/react-query";
import { mapEnterTicketRow } from "../WaitingRoom/component/enterTicketmapper";

export const UseTicketID = (id: string) => {
    const query = useQuery({
        queryKey: ['ticketID', id],
        queryFn: async () => {
            const res = await ticketApi.getTicketById(id);
            return mapEnterTicketRow(res);
        }
    });
    return {
        ticket: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
export const UsePrescription = (name: string) => {
    const query = useQuery({
        queryKey: ['medicines', name],
        queryFn: async () => {
            const res = await prescriptionApi.getMedicine(name);
            return res.data as Medicine[];
        }
    });
    return {
        medicineOptions: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
export const UsePostExamine = () => {
    return useMutation({
        mutationFn: async (data: PostExamineData) => {
            return await examineApi.postExamination(data);
        },
    });
};
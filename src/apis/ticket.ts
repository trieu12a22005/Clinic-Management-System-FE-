import type { EnterTicketParams } from '@/types/EnterTicket';
import { apiClient } from './axios';
class TicketApi {
  async getTicket(params: EnterTicketParams) {
    const response = await apiClient.get('/examine/ticket', {
      params,
    });
    return response.data;
  }
  async getTicketById(id: string) {
    const response = await apiClient.get(`/examine/ticket/${id}`);
    return response.data;
  } 
}
const ticketApi = new TicketApi();
export default ticketApi;
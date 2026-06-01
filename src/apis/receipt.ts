import { apiClient } from './axios';

export interface PrescriptionSummary {
  prescriptionID: string;
  prescriptionDisplayID: string | null;
  payAmount: number;
}

export interface ReceiptData {
  appointmentID: string;
  appointmentDisplayID: string;
  patientDisplayID: string | null;
  patientName: string;
  appointmentDate: string;
  examineFee: number;
  prescriptionFee: number | null;
  totalFee: number;
  prescriptions: PrescriptionSummary[];
}

export interface GetReceiptResponse {
  message: string;
  data: ReceiptData;
}

class ReceiptApi {
  async getReceipt(appointmentID: string): Promise<GetReceiptResponse> {
    const response = await apiClient.get<GetReceiptResponse>(
      `/receipt/${appointmentID}`
    );
    return response.data;
  }
}

const receiptApi = new ReceiptApi();
export default receiptApi;

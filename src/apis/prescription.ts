import {apiClient} from "./axios";

/**
 * Medicine item structure for prescription details
 */
interface PrescriptionMedicineItem {
  medicineID: number;
  usage: string; // Dosage instructions (e.g., "uống, sáng 2 viên, chiều 1 viên")
  note?: string; // Optional note for this medicine
  quantity?: number; // Required when usage is free-form text
}

/**
 * Request body for creating a new prescription
 */
interface CreatePrescriptionRequest {
  examineID: string; // UUID of the examine log
  totalTreatmentDays: number; // Total number of treatment days (minimum 1)
  note?: string; // Optional general notes for the prescription (max 255 chars)
  needReExamine?: boolean; // Whether patient needs follow-up examination
  details: PrescriptionMedicineItem[]; // List of prescribed medicines (at least 1 required)
}

/**
 * Response data for created prescription
 */
interface MedicineInfo {
  medicineID: number;
  medicineName: string;
  medicineImage?: string | null;
  unit: string;
  price: number;
  stock: number; // Available stock quantity
  quantity: number; // Total quantity of this medicine in inventory
}

interface PrescriptionDetail {
  medicine: MedicineInfo;
  quantity: number;
  usage: string;
}

interface PrescriptionData {
  prescriptionID: string;
  prescriptionDisplayID: string;
  createdAt: string;
  createdAtLocal?: string;
  note?: string | null;
  needReExamine: boolean;
  totalTreatmentDays: number;
  details: PrescriptionDetail[];
}

interface CreatePrescriptionResponse {
  message: string; // "Create prescription successfully"
  prescription: PrescriptionData;
}

/**
 * Request body for updating prescription header info
 */
interface UpdatePrescriptionRequest {
  note?: string; // Updated general notes (max 255 chars)
  needReExamine?: boolean; // Whether patient needs follow-up examination
  totalTreatmentDays?: number; // Total treatment days (minimum 1)
}

interface UpdatePrescriptionResponse {
  message: string; // "Đã cập nhật toa thuốc"
  prescription: PrescriptionData;
}

/**
 * Request body for updating prescription medicine details (upsert/delete)
 */
interface UpdatePrescriptionDetailsRequest {
  details: PrescriptionMedicineItem[]; // Medicines to upsert (empty array if only deleting)
  deleteList?: number[]; // List of medicineIDs to remove
}

interface UpdateDetailsResponse {
  message: string; // "Đã cập nhật toa thuốc" or "Đã xóa toa thuốc"
  prescription?: PrescriptionData; // Not present if prescription was deleted
  reason?: string; // Reason for deletion if prescription was deleted
}

/**
 * Response for getting prescription by ID
 */
interface GetPrescriptionResponse {
  prescription: PrescriptionData;
}

/**
 * Response for delete operations
 */
interface DeleteResponse {
  message: string; // "Đã xóa đơn thuốc"
}

/**
 * PrescriptionService - Handles all prescription-related API calls
 * All methods require valid authentication token (bearerAuth)
 * Only accessible by doctors
 */
class PrescriptionService {
  /**
   * Create a new draft prescription
   *
   * @description
   * Creates a new prescription linked to an examine log. The `examinedBy` (doctorID)
   * is automatically resolved from the `examineID`. For medicine items with solely
   * dose format usage (e.g., "uống, sáng 2 viên, chiều 1 viên"), quantity is
   * automatically calculated from `totalTreatmentDays`. Otherwise, `quantity` must
   * be provided explicitly.
   *
   * @param request - CreatePrescriptionRequest object
   * @returns Promise<CreatePrescriptionResponse>
   *
   * @throws 400 - Validation error (invalid body fields)
   * @throws 401 - Unauthorized (missing or invalid access token)
   * @throws 403 - Forbidden (only doctors can access this endpoint)
   * @throws 404 - Examine log not found for the given `examineID`
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await prescriptionService.createPrescription({
   *   examineID: "d5e6f7a8-b9c0-1234-defa-345678901234",
   *   totalTreatmentDays: 7,
   *   needReExamine: true,
   *   note: "Tái khám sau 7 ngày",
   *   details: [
   *     {
   *       medicineID: 1,
   *       usage: "uống, sáng 2 viên, chiều 1 viên"
   *     },
   *     {
   *       medicineID: 2,
   *       usage: "Bôi ngoài da",
   *       quantity: 1
   *     }
   *   ]
   * });
   */
  async createPrescription(
    request: CreatePrescriptionRequest
  ): Promise<CreatePrescriptionResponse> {
    const response = await apiClient.post<CreatePrescriptionResponse>(
      "/prescription/new",
      request
    );
    return response.data;
  }

  /**
   * Update prescription header information
   *
   * @description
   * Updates top-level fields of a draft prescription (note, needReExamine, totalTreatmentDays).
   * When `totalTreatmentDays` changes, all medicine quantities are proportionally recalculated.
   * Only the doctor who created the prescription can update it, and only on the same calendar
   * day it was created. The prescription must still be in `draft` status.
   * Cannot update and delete medicine items simultaneously (use updatePrescriptionDetails for that).
   *
   * @param id - UUID of the prescription to update
   * @param request - UpdatePrescriptionRequest object with fields to update
   * @returns Promise<UpdatePrescriptionResponse>
   *
   * @throws 400 - Validation error
   * @throws 401 - Unauthorized (missing or invalid access token)
   * @throws 403 - Forbidden:
   *   - Not the prescribing doctor
   *   - Prescription status is already `done`
   *   - Attempting to update after the creation date
   * @throws 404 - Prescription not found or not in draft status
   * @throws 422 - Cannot simultaneously update and delete medicines in the same request
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await prescriptionService.updatePrescription(
   *   "e6f7a8b9-c0d1-2345-efab-456789012345",
   *   {
   *     note: "Tái khám sau 5 ngày",
   *     needReExamine: false,
   *     totalTreatmentDays: 5
   *   }
   * );
   */
  async updatePrescription(
    id: string,
    request: UpdatePrescriptionRequest
  ): Promise<UpdatePrescriptionResponse> {
    const response = await apiClient.put<UpdatePrescriptionResponse>(
      `/prescription/${id}`,
      request
    );
    return response.data;
  }

  /**
   * Update prescription medicine details (upsert / delete)
   *
   * @description
   * Upserts (create or update) medicine items in a draft prescription and/or removes specific medicines.
   * If all medicines are removed, the prescription itself is automatically deleted.
   * The same update constraints apply: only the creating doctor, on the same day, while still in `draft` status.
   * You cannot include the same `medicineID` in both `details` (upsert) and `deleteList` in one request.
   *
   * @param id - UUID of the prescription to update
   * @param request - UpdatePrescriptionDetailsRequest object with medicines to upsert and/or delete
   * @returns Promise<UpdateDetailsResponse>
   *
   * @throws 400 - Validation error
   * @throws 401 - Unauthorized (missing or invalid access token)
   * @throws 403 - Forbidden:
   *   - Not the prescribing doctor
   *   - Prescription status is already `done`
   *   - Attempting to update after the creation date
   * @throws 404 - Prescription not found or not in draft status
   * @throws 422 - Same `medicineID` appears in both `details` and `deleteList`
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await prescriptionService.updatePrescriptionDetails(
   *   "e6f7a8b9-c0d1-2345-efab-456789012345",
   *   {
   *     details: [
   *       {
   *         medicineID: 3,
   *         usage: "uống, sáng 1 viên"
   *       }
   *     ],
   *     deleteList: [2]
   *   }
   * );
   */
  async updatePrescriptionDetails(
    id: string,
    request: UpdatePrescriptionDetailsRequest
  ): Promise<UpdateDetailsResponse> {
    const response = await apiClient.put<UpdateDetailsResponse>(
      `/prescription/${id}/details`,
      request
    );
    return response.data;
  }

  /**
   * Get prescription by ID
   *
   * @description
   * Returns full prescription data including all medicine details.
   * Accessible only by doctors. Returns both draft and finalized prescriptions.
   *
   * @param id - UUID of the prescription to retrieve
   * @returns Promise<GetPrescriptionResponse>
   *
   * @throws 401 - Unauthorized (missing or invalid access token)
   * @throws 403 - Forbidden (only doctors can access this endpoint)
   * @throws 404 - Prescription not found
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await prescriptionService.getPrescription(
   *   "e6f7a8b9-c0d1-2345-efab-456789012345"
   * );
   * // Returns:
   * // {
   * //   prescription: {
   * //     prescriptionID: "e6f7a8b9-c0d1-2345-efab-456789012345",
   * //     createdAt: "2026-03-10T08:00:00.000Z",
   * //     createdAtLocal: "10/03/2026 15:00",
   * //     note: "Tái khám sau 7 ngày",
   * //     needReExamine: true,
   * //     totalTreatmentDays: 7,
   * //     details: [
   * //       {
   * //         medicine: {
   * //           medicineID: 1,
   * //           medicineName: "Paracetamol",
   * //           medicineImage: "https://example.com/paracetamol.jpg",
   * //           unit: "viên",
   * //           price: 5000
   * //         },
   * //         quantity: 21,
   * //         usage: "uống, sáng 2 viên, chiều 1 viên"
   * //       }
   * //     ]
   * //   }
   * // }
   */
  async getPrescription(id: string): Promise<GetPrescriptionResponse> {
    const response = await apiClient.get<GetPrescriptionResponse>(
      `/prescription/${id}`
    );
    return response.data;
  }

  /**
   * Delete a draft prescription
   *
   * @description
   * Permanently deletes a prescription. Only the doctor who created it can delete it,
   * and only while it is still in `draft` status. Prescriptions with `done` status
   * cannot be deleted.
   *
   * @param id - UUID of the prescription to delete
   * @returns Promise<DeleteResponse>
   *
   * @throws 401 - Unauthorized (missing or invalid access token)
   * @throws 403 - Forbidden (only doctors can access this endpoint)
   * @throws 404 - Prescription not found, not in draft status, or does not belong to the requesting doctor
   * @throws 500 - Internal server error
   *
   * @example
   * const response = await prescriptionService.deletePrescription(
   *   "e6f7a8b9-c0d1-2345-efab-456789012345"
   * );
   */
  async deletePrescription(id: string): Promise<DeleteResponse> {
    const response = await apiClient.delete<DeleteResponse>(
      `/prescription/${id}`
    );
    return response.data;
  }
}

// Export singleton instance
export default new PrescriptionService();

// Export types for external use
export type {
  PrescriptionMedicineItem,
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  UpdatePrescriptionRequest,
  UpdatePrescriptionResponse,
  UpdatePrescriptionDetailsRequest,
  UpdateDetailsResponse,
  GetPrescriptionResponse,
  DeleteResponse,
  PrescriptionData,
  PrescriptionDetail,
  MedicineInfo,
};

import { apiClient } from './axios';

export type MedicineTicketStatus = 'pending' | 'done';

export interface MedicineTicket {
  ticketID: string;
  orderNum: number | string;
  status: MedicineTicketStatus;
  prescriptionID: string;
  roomID?: string;
  createdAt?: string;
}

export interface MedicineTicketsResponse {
  message: string;
  data: MedicineTicket[];
}

export interface CreateMedicineTicketPayload {
  prescriptionID: string;
  roomID: string;
}

export interface CreateMedicineTicketResponse {
  message: string;
  data: MedicineTicket;
}

export interface UpdateMedicineTicketStatusPayload {
  status: MedicineTicketStatus;
}

export interface UpdateMedicineTicketStatusResponse {
  message: string;
  data: MedicineTicket;
}

export interface MedicineUnitItem {
  unitID: number;
  unitName: string;
}

export interface GetMedicineUnitsResponse {
  message: string;
  data: MedicineUnitItem[];
}

export interface CreateMedicineUnitPayload {
  unitName: string;
}

export interface CreateMedicineUnitResponse {
  message: string;
  data: MedicineUnitItem;
}

export interface MedicineUsageItem {
  id: number;
  usage: string;
}

export interface GetMedicineUsagesResponse {
  message: string;
  data: MedicineUsageItem[];
}

export interface CreateMedicineUsagePayload {
  usage: string;
}

export interface CreateMedicineUsageResponse {
  message: string;
  data: MedicineUsageItem;
}

export type MedicineUnit = 'bottle' | 'capsule' | 'patches' | string | number;

export interface MedicineItem {
  medicineID: number;
  medicineName: string;
  unit: MedicineUnit | MedicineUnitItem;
  price: number;
  quantity: number;
  description?: string;
  medicineImage?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface CreateMedicineItemPayload {
  medicineName: string;
  unitID: number;
  price: number;
  description?: string;
  image?: File | Blob;
}

export interface CreateMedicineItemResponse {
  message: string;
  data: MedicineItem;
}

export interface CreateManyMedicineItemInput {
  medicineName: string;
  unitID: number;
  price: number;
  description?: string;
}

export type CreateManyMedicineItemsPayload = CreateManyMedicineItemInput[];

export interface CreateManyMedicineItemsResponse {
  message: string;
  data: {
    requestCount: number;
    successCount: number;
    failedCount: number;
    success: Array<{
      index: number;
      medicineName: string;
      [key: string]: unknown;
    }>;
    failed: Array<{
      index: number;
      medicineName: string;
      reason: string;
      [key: string]: unknown;
    }>;
  };
}

export interface GetMedicineItemsParams {
  search?: string;
  page?: number;
}

export interface GetMedicineItemsResponse {
  message: string;
  data: MedicineItem[] | {
    medicines?: MedicineItem[];
    items?: MedicineItem[];
    page?: number;
    totalPages?: number;
    totalItems?: number;
    [key: string]: unknown;
  };
}

export interface GetMedicineItemByIdResponse {
  message: string;
  data: MedicineItem;
}

export interface UpdateMedicineItemPayload {
  medicineName?: string;
  unitID?: number;
  price?: number;
  description?: string;
  image?: File | Blob;
}

export interface UpdateMedicineItemResponse {
  message: string;
  data: MedicineItem;
}

export interface DeleteMedicineItemResponse {
  message: string;
  data?: unknown;
}

export type ImexType = 'import' | 'export';

export interface ImexItemPayload {
  medicineID: number;
  quantity: number;
  note?: string;
}

export interface ImexLog {
  imexID: string;
  imexType: ImexType;
  pharmacistID: string;
  value?: number;
  note?: string;
  items?: ImexItemPayload[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface GetImexLogsParams {
  type?: ImexType;
  from?: string;
  to?: string;
}

export interface GetImexLogsResponse {
  message: string;
  data: ImexLog[];
}

export interface GetImexByIdResponse {
  message: string;
  data: ImexLog;
}

export interface CreateImexLogPayload {
  imexType: ImexType;
  pharmacistID: string;
  value?: number;
  note?: string;
  items: ImexItemPayload[];
}

export interface CreateImexLogResponse {
  message: string;
  data: ImexLog;
}

export interface UpdateImexLogPayload {
  value?: number;
  note?: string;
  items?: ImexItemPayload[];
}

export interface UpdateImexLogResponse {
  message: string;
  data: ImexLog;
}

export interface DeleteImexLogResponse {
  message: string;
  data?: unknown;
}

class MedicineApi {
  private buildMedicineFormData(
    payload: CreateMedicineItemPayload | UpdateMedicineItemPayload
  ) {
    const formData = new FormData();

    if (payload.medicineName !== undefined) {
      formData.append('medicineName', payload.medicineName);
    }

    if (payload.unitID !== undefined) {
      formData.append('unitID', String(payload.unitID));
    }

    if (payload.price !== undefined) {
      formData.append('price', String(payload.price));
    }

    if (payload.description !== undefined) {
      formData.append('description', payload.description);
    }

    if (payload.image !== undefined) {
      formData.append('image', payload.image);
    }

    return formData;
  }

  /**
   * Create a new medicine
   *
   * @description
   * Create a new medicine item with optional image upload to Cloudinary.
   * Image will be stored with default placeholder if not provided.
   * - Content-Type: multipart/form-data
   * - Required fields: medicineName, unit, price
   * - image is optional (File/Blob)
   *
   * @param payload - Medicine data to create
   * @param payload.medicineName - Unique name of the medicine (required)
   * @param payload.unit - Unit/form of the medicine (required): 'bottle', 'capsule', or 'patches'
   * @param payload.price - Price of the medicine in VND (required)
   * @param payload.description - Optional detailed description of the medicine
   * @param payload.image - Optional medicine image file (File or Blob)
   * @returns Promise<CreateMedicineItemResponse> - Medicine created successfully with medicineID, medicineName, unit, price, quantity, description, and medicineImage
   * @throws Error on missing required fields (400), duplicate medicine name (409), or server error (500)
   *
   * @example
   * const response = await medicineApi.createMedicineItem({
   *   medicineName: 'Aspirin',
   *   unit: 'bottle',
   *   price: 50000,
   *   description: 'Pain relief and fever reducer'
   * });
   * console.log(response.data.medicineID); // Created medicine ID
   */
  async createMedicineItem(payload: CreateMedicineItemPayload) {
    const formData = this.buildMedicineFormData(payload);
    const response = await apiClient.post<CreateMedicineItemResponse>(
      '/medicine/items',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Create multiple medicines at once
   *
   * @description
   * Bulk create medicines from a JSON array. Returns success and failure details for each medicine.
   * Each failure is tracked with the reason (duplicate unique, validation error, etc).
   * - Content-Type: application/json
   * - Returns statistics of successful and failed creations
   * - Detailed list of successfully created and failed medicines with error reasons
   *
   * @param payload - Array of medicines to create (minimum 1 item)
   * @param payload[].medicineName - Unique name of the medicine (required)
   * @param payload[].unit - Unit/form of the medicine (required): 'bottle', 'capsule', 'patches'
   * @param payload[].price - Price of the medicine in VND (required)
   * @param payload[].description - Optional detailed description
   * @returns Promise<CreateManyMedicineItemsResponse> - Bulk creation result with:
   *   - requestCount: Total number of medicines requested
   *   - successCount: Number of medicines created successfully
   *   - failedCount: Number of medicines that failed
   *   - success: Array of successfully created medicines (index, medicineName)
   *   - failed: Array of failed medicines (index, medicineName, reason)
   *     Possible reasons: DUPLICATE_UNIQUE, PRISMA_P2003, Missing required fields for medicine at index X
   * @throws Error if payload is not an array or empty array provided (400), or server error (500)
   *
   * @example
   * const response = await medicineApi.createManyMedicineItems([
   *   {
   *     medicineName: 'Aspirin',
   *     unit: 'bottle',
   *     price: 50000,
   *     description: 'Pain relief'
   *   },
   *   {
   *     medicineName: 'Ibuprofen',
   *     unit: 'capsule',
   *     price: 35000,
   *     description: 'Anti-inflammatory'
   *   }
   * ]);
   * console.log(response.data.successCount); // Number of successful creations
   * console.log(response.data.success); // Details of successful medicines
   */
  async createManyMedicineItems(payload: CreateManyMedicineItemsPayload) {
    const response = await apiClient.post<CreateManyMedicineItemsResponse>(
      '/medicine/items/many',
      payload
    );
    return response.data;
  }

  /**
   * Get medicines with search and pagination
   *
   * @description
   * Retrieve medicines with optional search by name and pagination support.
   * Supports case-insensitive search. Without query params, returns first page of all medicines.
   * - Default pagination: 10 items per page
   * - search: Case-insensitive partial match on medicine name
   * - page: Page number starting from 1 (default 1)
   *
   * @param params - Query parameters (optional)
   * @param params.search - Search medicines by name (case-insensitive, partial match)
   * @param params.page - Page number (starts from 1, default 1). 10 items per page
   * @returns Promise<GetMedicineItemsResponse> - Array of medicines with pagination information:
   *   - data: Array of medicines with medicineID, medicineName, unit, price, quantity, description, medicineImage, createdAt
   *   - pagination: Object with currentPage, pageSize (10), totalItems, totalPages
   * @throws Error on invalid page number (400) or server error (500)
   *
   * @example
   * // Get first page of all medicines
   * const response = await medicineApi.getMedicineItems();
   * console.log(response.data); // Array of medicines
   * console.log(response.data.pagination); // Pagination info
   *
   * @example
   * // Search medicines by name
   * const response = await medicineApi.getMedicineItems({ search: 'Aspirin' });
   * console.log(response.data); // Array of medicines matching 'Aspirin'
   *
   * @example
   * // Get specific page
   * const response = await medicineApi.getMedicineItems({ page: 2 });
   * console.log(response.data.pagination.totalPages); // Total pages
   */
  async getMedicineItems(params?: GetMedicineItemsParams) {
    const response = await apiClient.get<GetMedicineItemsResponse>(
      '/medicine/items',
      {
        params,
      }
    );
    return response.data;
  }

  /**
   * Get medicine by ID
   *
   * @description
   * Retrieve a specific medicine by its integer ID with all details including image and timestamps.
   *
   * @param id - Medicine ID (integer, not UUID)
   * @returns Promise<GetMedicineItemByIdResponse> - Medicine details:
   *   - medicineID: Integer ID of the medicine
   *   - medicineName: Name of the medicine
   *   - unit: Unit/form (bottle, capsule, patches)
   *   - price: Price in VND
   *   - quantity: Available quantity
   *   - description: Detailed description
   *   - medicineImage: URL of the medicine image
   *   - createdAt: ISO timestamp of creation
   * @throws Error on missing medicine ID (400), medicine not found (404), or server error (500)
   *
   * @example
   * const response = await medicineApi.getMedicineItemById(1);
   * console.log(response.data.medicineName); // 'Aspirin'
   * console.log(response.data.price); // 50000
   * console.log(response.data.createdAt); // Creation timestamp
   */
  async getMedicineItemById(id: number | string) {
    const response = await apiClient.get<GetMedicineItemByIdResponse>(
      `/medicine/items/${id}`
    );
    return response.data;
  }

  /**
   * Update medicine
   *
   * @description
   * Update medicine details (name, unit, price, description) with optional image replacement.
   * If new image provided, old image is automatically deleted from Cloudinary.
   * - Content-Type: multipart/form-data
   * - All fields are optional (can update individual fields)
   * - If no image provided, existing image is retained
   *
   * @param id - Medicine ID (integer)
   * @param payload - Data to update (all fields optional)
   * @param payload.medicineName - New medicine name (optional if not updating)
   * @param payload.unit - New unit/form (optional): 'bottle', 'capsule', 'patches'
   * @param payload.price - New price in VND (optional if not updating)
   * @param payload.description - New description (optional)
   * @param payload.image - New medicine image (optional - old image will be deleted if provided)
   * @returns Promise<UpdateMedicineItemResponse> - Updated medicine with all fields including medicineImage and createdAt
   * @throws Error on missing medicine ID (400), medicine not found (404), or server error (500)
   *
   * @example
   * const response = await medicineApi.updateMedicineItem(1, {
   *   price: 55000,
   *   description: 'Enhanced pain relief formula'
   * });
   * console.log(response.data.price); // 55000
   * console.log(response.data.medicineImage); // Updated image URL
   */
  async updateMedicineItem(
    id: number | string,
    payload: UpdateMedicineItemPayload
  ) {
    const formData = this.buildMedicineFormData(payload);
    const response = await apiClient.patch<UpdateMedicineItemResponse>(
      `/medicine/items/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Delete medicine
   *
   * @description
   * Delete a medicine and its associated image from Cloudinary. This is a hard delete operation.
   *
   * @param id - Medicine ID (integer)
   * @returns Promise<DeleteMedicineItemResponse> - Success message
   * @throws Error on missing medicine ID (400), medicine not found (404), or server error (500)
   *
   * @example
   * const response = await medicineApi.deleteMedicineItem(1);
   * console.log(response.message); // 'Medicine deleted successfully'
   */
  async deleteMedicineItem(id: number | string) {
    const response = await apiClient.delete<DeleteMedicineItemResponse>(
      `/medicine/items/${id}`
    );
    return response.data;
  }

  async getImexLogs(params?: GetImexLogsParams) {
    const response = await apiClient.get<GetImexLogsResponse>('/medicine/imex', {
      params,
    });
    return response.data;
  }

  async getImexById(id: string) {
    const response = await apiClient.get<GetImexByIdResponse>(
      `/medicine/imex/${id}`
    );
    return response.data;
  }

  async createImexLog(payload: CreateImexLogPayload) {
    const response = await apiClient.post<CreateImexLogResponse>(
      '/medicine/imex',
      payload
    );
    return response.data;
  }

  async updateImexLog(id: string, payload: UpdateImexLogPayload) {
    const response = await apiClient.patch<UpdateImexLogResponse>(
      `/medicine/imex/${id}`,
      payload
    );
    return response.data;
  }

  async deleteImexLog(id: string) {
    const response = await apiClient.delete<DeleteImexLogResponse>(
      `/medicine/imex/${id}`
    );
    return response.data;
  }

  async createMedicineTicket(payload: CreateMedicineTicketPayload) {
    const response = await apiClient.post<CreateMedicineTicketResponse>(
      '/medicine/tickets',
      payload
    );
    return response.data;
  }

  async getMedicineTickets(params?: { date?: string; roomId?: string }) {
    const response = await apiClient.get<MedicineTicketsResponse>(
      '/medicine/tickets',
      {
        params,
      }
    );
    return response.data;
  }

  async updateMedicineTicketStatus(
    ticketId: string,
    payload: UpdateMedicineTicketStatusPayload
  ) {
    const response = await apiClient.patch<UpdateMedicineTicketStatusResponse>(
      `/medicine/tickets/${ticketId}/status`,
      payload
    );
    return response.data;
  }

  async getMedicineUnits() {
    const response = await apiClient.get<GetMedicineUnitsResponse>('/medicine/units');
    return response.data;
  }

  async createMedicineUnit(payload: CreateMedicineUnitPayload) {
    const response = await apiClient.post<CreateMedicineUnitResponse>('/medicine/units', payload);
    return response.data;
  }

  async deleteMedicineUnit(id: number) {
    const response = await apiClient.delete(`/medicine/units/${id}`);
    return response.data;
  }

  async getMedicineUsages() {
    const response = await apiClient.get<GetMedicineUsagesResponse>('/medicine/usages');
    return response.data;
  }

  async createMedicineUsage(payload: CreateMedicineUsagePayload) {
    const response = await apiClient.post<CreateMedicineUsageResponse>('/medicine/usages', payload);
    return response.data;
  }

  async deleteMedicineUsage(id: number) {
    const response = await apiClient.delete(`/medicine/usages/${id}`);
    return response.data;
  }
}

const medicineApi = new MedicineApi();
export default medicineApi;

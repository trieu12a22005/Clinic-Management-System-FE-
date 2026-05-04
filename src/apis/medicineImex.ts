import { apiClient } from "./axios";

/**
 * Loại dữ liệu cho loại import/export
 */
export type ImexType = "import" | "export";

/**
 * Thông tin thuốc trong chi tiết phiếu
 * @property medicineName - Tên thuốc
 * @property unit - Đơn vị (bottle, capsule, patches)
 * @property price - Giá thuốc (VND)
 */
export interface MedicineInfo {
  medicineName: string;
  unit: "bottle" | "capsule" | "patches";
  price: number;
}

/**
 * Loại dữ liệu cho item trong phiếu nhập xuất
 * @property medicineID - ID của thuốc
 * @property quantity - Số lượng thay đổi (dương=import, âm=export)
 * @property note - Ghi chú cho item (tùy chọn)
 * @property medicine - Thông tin chi tiết của thuốc (tùy chọn)
 */
export interface ImexDetail {
  medicineID: number;
  quantity: number;
  note?: string | null;
  medicine?: MedicineInfo;
}

/**
 * Thông tin dược sĩ tạo phiếu
 * @property id - ID duy nhất của dược sĩ (UUID)
 * @property name - Tên đầy đủ của dược sĩ
 */
export interface PharmacistInfo {
  id?: string;
  name?: string;
}

/**
 * Loại dữ liệu cho phản hồi danh sách phiếu
 * @property imexID - ID duy nhất của phiếu (UUID)
 * @property imexType - Loại phiếu (import hoặc export)
 * @property pharmacist - Thông tin dược sĩ tạo phiếu
 * @property value - Giá trị tổng cộng (VND)
 * @property note - Ghi chú (tùy chọn)
 * @property createdAt - Thời gian tạo phiếu
 */
export interface ImexLogItem {
  imexID: string;
  imexType: ImexType;
  pharmacist?: PharmacistInfo;
  value?: number;
  note?: string | null;
  createdAt?: string;
}

/**
 * Loại dữ liệu cho chi tiết phiếu
 * @property imexID - ID duy nhất của phiếu (UUID)
 * @property imexType - Loại phiếu (import hoặc export)
 * @property pharmacist - Thông tin dược sĩ tạo phiếu
 * @property value - Giá trị tổng cộng (VND)
 * @property note - Ghi chú (tùy chọn)
 * @property createdAt - Thời gian tạo phiếu
 * @property details - Danh sách chi tiết các mục thuốc
 */
export interface ImexLog {
  imexID: string;
  imexType: ImexType;
  pharmacist?: PharmacistInfo;
  value?: number;
  note?: string | null;
  createdAt?: string;
  details?: ImexDetail[];
}

/**
 * Loại dữ liệu cho phản hồi lấy danh sách imex logs (có phân trang)
 */
export interface GetImexLogsResponse {
  message: string;
  data: ImexLogItem[];
  pagination: PaginationInfo;
}

/**
 * Loại dữ liệu cho phản hồi lấy imex log theo ID
 */
export interface GetImexByIdResponse {
  message: string;
  data: ImexLog;
}

/**
 * Loại dữ liệu cho request tạo imex log
 * @property imexType - Loại phiếu (bắt buộc): 'import' hoặc 'export'
 * @property value - Giá trị tổng cộng (VND, tùy chọn, mặc định = 0)
 * @property note - Ghi chú (tùy chọn)
 * @property items - Mảng các item thuốc (bắt buộc, tối thiểu 1)
 * @note pharmacistID được lấy tự động từ tài khoản dược sĩ đang đăng nhập
 */
export interface CreateImexLogPayload {
  imexType: ImexType;
  value?: number;
  note?: string;
  items: ImexDetail[];
}

/**
 * Loại dữ liệu cho phản hồi tạo imex log
 */
export interface CreateImexLogResponse {
  message: string;
  data: ImexLog;
}

/**
 * Loại dữ liệu cho request tạo nhiều phiếu imex log
 * @property imexType - Loại phiếu (bắt buộc): 'import' hoặc 'export'
 * @property value - Giá trị tổng cộng (VND, tùy chọn, mặc định = 0)
 * @property note - Ghi chú (tùy chọn)
 * @property items - Mảng các item thuốc (bắt buộc, tối thiểu 1)
 * @note pharmacistID được lấy tự động từ tài khoản dược sĩ đang đăng nhập
 */
export interface CreateManyImexLogPayload {
  imexType: ImexType;
  value?: number;
  note?: string;
  items: ImexDetail[];
}

/**
 * Loại dữ liệu cho phản hồi tạo nhiều phiếu imex log
 */
export interface CreateManyImexLogResponse {
  message: string;
  data: ImexLog;
}

/**
 * Loại dữ liệu cho request cập nhật imex log
 * @property value - Giá trị tổng cộng (VND, tùy chọn)
 * @property note - Ghi chú (tùy chọn)
 * @property items - Danh sách items để thêm/cập nhật (tùy chọn)
 */
export interface UpdateImexLogPayload {
  value?: number;
  note?: string;
  items?: ImexDetail[];
}

/**
 * Loại dữ liệu cho phản hồi cập nhật imex log
 */
export interface UpdateImexLogResponse {
  message: string;
  data: ImexLog;
}

/**
 * Loại dữ liệu cho phản hồi xóa imex log
 */
export interface DeleteImexLogResponse {
  message: string;
  data?: unknown;
}

/**
 * Loại dữ liệu cho thông tin phân trang
 * @property currentPage - Số thứ tự trang hiện tại
 * @property pageSize - Số lượng items trên mỗi trang
 * @property totalItems - Tổng số items
 * @property totalPages - Tổng số trang
 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Loại dữ liệu cho tham số query lấy imex logs
 * @property type - Loại phiếu cần lọc (import hoặc export, tùy chọn)
 * @property from - Ngày bắt đầu (định dạng ISO 8601, tùy chọn)
 * @property to - Ngày kết thúc (định dạng ISO 8601, tùy chọn)
 * @property page - Số thứ tự trang (tùy chọn, mặc định = 1, tối thiểu = 1)
 * @property pageSize - Số lượng phiếu trên mỗi trang (tùy chọn, mặc định = 10, tối thiểu = 1)
 */
export interface GetImexLogsParams {
  type?: ImexType;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Lấy danh sách phiếu nhập xuất thuốc (Get Imex Logs)
 *
 * @description
 * Lấy danh sách các phiếu nhập/xuất thuốc với các bộ lọc tùy chọn theo loại (nhập/xuất), khoảng thời gian và hỗ trợ phân trang.
 * - Dữ liệu trả về được sắp xếp theo thời gian tạo (mới nhất trước)
 * - Không cung cấp query params sẽ trả về tất cả phiếu (trả về mảng rỗng nếu không có)
 * - Khoảng thời gian: từ 'from' đến 'to' (định dạng ISO 8601)
 * - Hỗ trợ phân trang với page (mặc định 1) và pageSize (mặc định 10)
 * - Yêu cầu quyền: pharmacist
 *
 * @param params - Tham số lọc và phân trang (tùy chọn)
 * @param params.type - Loại phiếu ('import'=nhập hoặc 'export'=xuất, không bắt buộc)
 * @param params.from - Ngày bắt đầu (ISO 8601 format, ví dụ: '2026-04-01T00:00:00Z', không bắt buộc)
 * @param params.to - Ngày kết thúc (ISO 8601 format, ví dụ: '2026-04-13T23:59:59Z', không bắt buộc)
 * @param params.page - Số thứ tự trang (không bắt buộc, mặc định 1, tối thiểu 1)
 * @param params.pageSize - Số lượng phiếu trên mỗi trang (không bắt buộc, mặc định 10, tối thiểu 1)
 * @returns Promise<GetImexLogsResponse> - Mảng danh sách phiếu với thông tin phân trang
 *   - data: Mảng phiếu (có thể rỗng nếu không có dữ liệu)
 *   - pagination: Thông tin phân trang (currentPage, pageSize, totalItems, totalPages)
 * @throws Error nếu định dạng ngày không hợp lệ (400), tham số phân trang không hợp lệ (400), không authorized (401) hoặc lỗi máy chủ (500)
 *
 * @example
 * // Lấy trang 1 với mặc định 10 phiếu/trang
 * const response = await getImexLogs();
 * console.log(response.data); // Mảng tối đa 10 phiếu
 * console.log(response.pagination); // { currentPage: 1, pageSize: 10, totalItems: 45, totalPages: 5 }
 *
 * @example
 * // Lọc theo loại import, trang 2, 20 phiếu/trang
 * const response = await getImexLogs({ type: 'import', page: 2, pageSize: 20 });
 * console.log(response.data); // Mảng phiếu nhập của trang 2
 * console.log(response.pagination.currentPage); // 2
 *
 * @example
 * // Lọc theo khoảng thời gian với phân trang
 * const response = await getImexLogs({
 *   from: '2026-04-01T00:00:00Z',
 *   to: '2026-04-13T23:59:59Z',
 *   page: 1,
 *   pageSize: 15
 * });
 * console.log(response.data); // Mảng phiếu trong khoảng thời gian
 * console.log(response.pagination.totalPages); // Tổng số trang
 */
export const getImexLogs = async (
  params?: GetImexLogsParams
): Promise<GetImexLogsResponse> => {
  const response = await apiClient.get<GetImexLogsResponse>(
    "/medicine/imex",
    {
      params,
    }
  );
  return response.data;
};

/**
 * Lấy chi tiết phiếu nhập xuất thuốc (Get Imex by ID)
 *
 * @description
 * Lấy thông tin chi tiết đầy đủ của một phiếu nhập/xuất thuốc bao gồm:
 * - Thông tin phiếu: ID, loại (nhập/xuất), giá trị, ghi chú
 * - Thông tin dược sĩ tạo phiếu (ID và tên)
 * - Danh sách các mục thuốc được nhập/xuất với thông tin thuốc chi tiết (tên, đơn vị, giá)
 * - Số lượng thay đổi (+ cho import, - cho export)
 * - Yêu cầu quyền: pharmacist
 *
 * @param id - ID duy nhất của phiếu nhập xuất (UUID format, bắt buộc)
 *            Ví dụ: '550e8400-e29b-41d4-a716-446655440000'
 * @returns Promise<GetImexByIdResponse> - Phản hồi chứa thông tin chi tiết phiếu
 *   Response structure:
 *   - message: Thông báo thành công (string, ví dụ: 'Imex log retrieved successfully')
 *   - data: Đối tượng ImexLog chứa:
 *     - imexID: ID duy nhất của phiếu (UUID)
 *     - imexType: Loại phiếu ('import' hoặc 'export')
 *     - pharmacist: Thông tin dược sĩ tạo phiếu:
 *       - id: ID duy nhất của dược sĩ (UUID)
 *       - name: Tên đầy đủ dược sĩ (ví dụ: 'Nguyen Hoa')
 *     - value: Tổng giá trị phiếu (VND, số thập phân, ví dụ: 500000)
 *     - note: Ghi chú phiếu (string hoặc null, ví dụ: 'Nhập từ nhà cung cấp A')
 *     - createdAt: Thời gian tạo phiếu (ISO 8601 format, ví dụ: '2026-04-13T10:30:00Z')
 *     - details: Danh sách chi tiết các mục thuốc được nhập/xuất:
 *       - medicineID: ID của thuốc (number)
 *       - quantity: Số lượng thay đổi (number, dương=import, âm=export, ví dụ: 100 hoặc -50)
 *       - note: Ghi chú mục (string hoặc null, ví dụ: 'Hộp đầy đủ')
 *       - medicine: Thông tin chi tiết thuốc:
 *         - medicineName: Tên thuốc (ví dụ: 'Aspirin 500mg')
 *         - unit: Đơn vị (bottle, capsule, hoặc patches, ví dụ: 'bottle')
 *         - price: Giá thuốc (VND, số thập phân, ví dụ: 5000)
 *
 * @throws Error khi:
 *   - ID không được cung cấp (400 - Bad Request)
 *   - Phiếu nhập xuất không tìm thấy (404 - Not Found)
 *   - Không được phép truy cập - Unauthorized (401 - Unauthorized)
 *   - Lỗi máy chủ (500 - Internal Server Error)
 *
 * @example
 * // Lấy chi tiết phiếu nhập
 * const response = await getImexById('550e8400-e29b-41d4-a716-446655440000');
 * console.log(response.message); // 'Imex log retrieved successfully'
 * console.log(response.data.imexType); // 'import'
 * console.log(response.data.pharmacist.name); // 'Nguyen Hoa'
 * console.log(response.data.pharmacist.id); // '660e8400-e29b-41d4-a716-446655440111'
 * console.log(response.data.details[0].quantity); // 100 (positive for import)
 * console.log(response.data.details[0].medicine.medicineName); // 'Aspirin 500mg'
 * console.log(response.data.value); // 500000
 *
 * @example
 * // Lấy chi tiết phiếu xuất
 * const response = await getImexById('550e8400-e29b-41d4-a716-446655440111');
 * console.log(response.data.imexType); // 'export'
 * console.log(response.data.details[0].quantity); // -50 (negative for export)
 * console.log(response.data.note); // 'Nhập từ nhà cung cấp A' (nullable)
 */
export const getImexById = async (
  id: string
): Promise<GetImexByIdResponse> => {
  const response = await apiClient.get<GetImexByIdResponse>(
    `/medicine/imex/${id}`
  );
  return response.data;
};

/**
 * Tạo phiếu nhập xuất thuốc mới (Create Imex Log)
 *
 * @description
 * Tạo phiếu nhập/xuất mới và cập nhật tồn kho trong một transaction:
 * - **Import**: Tăng số lượng thuốc trong kho
 * - **Export**: Giảm số lượng thuốc trong kho
 * - **pharmacistID được tự động lấy từ tài khoản pharmacist đang đăng nhập**
 * - Phải cung cấp ít nhất 1 mục thuốc với số lượng > 0
 * - Tất cả thay đổi được thực hiện atomically (nguyên tố, không chia rẽ)
 * - Trả về thông tin phiếu vừa tạo cùng danh sách chi tiết items
 * - Yêu cầu quyền: pharmacist
 *
 * @param payload - Dữ liệu tạo phiếu
 * @param payload.imexType - Loại phiếu ('import'=nhập hoặc 'export'=xuất, bắt buộc)
 * @param payload.value - Tổng giá trị phiếu (VND, tùy chọn, mặc định = 0)
 * @param payload.note - Ghi chú thêm của phiếu (tùy chọn)
 * @param payload.items - Danh sách mục thuốc (bắt buộc, tối thiểu 1)
 * @param payload.items[].medicineID - ID thuốc (bắt buộc)
 * @param payload.items[].quantity - Số lượng (bắt buộc, phải > 0)
 * @param payload.items[].note - Ghi chú mục (tùy chọn)
 * @returns Promise<CreateImexLogResponse> - Phiếu vừa tạo với chi tiết đầy đủ
 * @throws Error nếu dữ liệu không hợp lệ (400), không authorized (401), hoặc lỗi máy chủ (500)
 *
 * @example
 * const response = await createImexLog({
 *   imexType: 'import',
 *   value: 500000,
 *   note: 'Nhập từ nhà cung cấp A',
 *   items: [
 *     { medicineID: 1, quantity: 100, note: 'Hộp chưa mở' },
 *     { medicineID: 2, quantity: 50 }
 *   ]
 * });
 * console.log(response.data.imexID); // UUID của phiếu vừa tạo
 * console.log(response.data.details); // Danh sách items đã tạo
 */
export const createImexLog = async (
  payload: CreateImexLogPayload
): Promise<CreateImexLogResponse> => {
  const response = await apiClient.post<CreateImexLogResponse>(
    "/medicine/imex",
    payload
  );
  return response.data;
};

/**
 * Tạo phiếu nhập xuất thuốc với nhiều mặt hàng (Create Many Imex Logs)
 *
 * @description
 * Tạo phiếu nhập/xuất với nhiều thuốc trong cùng một lần gọi API.
 * - **pharmacistID được lấy tự động từ tài khoản đăng nhập hiện tại**
 * - Hỗ trợ tạo phiếu import (nhập thuốc) hoặc export (xuất thuốc)
 * - Tồn kho tự động cập nhật cho tất cả items
 * - Yêu cầu quyền: pharmacist
 *
 * @param payload - Dữ liệu tạo phiếu
 * @param payload.imexType - Loại phiếu ('import'=nhập hoặc 'export'=xuất, bắt buộc)
 * @param payload.value - Tổng giá trị phiếu (VND, tùy chọn)
 * @param payload.note - Ghi chú (tùy chọn)
 * @param payload.items - Danh sách items thuốc (bắt buộc, tối thiểu 1)
 * @param payload.items[].medicineID - ID thuốc (bắt buộc)
 * @param payload.items[].quantity - Số lượng (bắt buộc, phải > 0)
 * @param payload.items[].note - Ghi chú item (tùy chọn)
 * @returns Promise<CreateManyImexLogResponse> - Phiếu được tạo thành công
 * @throws Error nếu dữ liệu không hợp lệ (400), không authorized (401), hoặc lỗi máy chủ (500)
 *
 * @example
 * const response = await createManyImexLog({
 *   imexType: 'import',
 *   value: 750000,
 *   note: 'Nhập hàng tháng 4',
 *   items: [
 *     { medicineID: 1, quantity: 100 },
 *     { medicineID: 2, quantity: 50 },
 *     { medicineID: 3, quantity: 75, note: 'Mẫu mới' }
 *   ]
 * });
 * console.log(response.data.imexID); // UUID của phiếu
 */
export const createManyImexLog = async (
  payload: CreateManyImexLogPayload
): Promise<CreateManyImexLogResponse> => {
  const response = await apiClient.post<CreateManyImexLogResponse>(
    "/medicine/imex/many",
    payload
  );
  return response.data;
};

/**
 * Cập nhật phiếu nhập xuất thuốc (Update Imex Log)
 *
 * @description
 * Cập nhật phiếu bao gồm giá trị, ghi chú, và danh sách mục thuốc.
 * - Có thể thêm mục mới, cập nhật mục cũ hoặc xóa mục
 * - Tồn kho tự động điều chỉnh dựa trên thay đổi số lượng
 * - **Lưu ý**: Các mục không có trong danh sách items mới sẽ bị xóa, tồn kho sẽ được điều chỉnh
 * - Tất cả trường đều tùy chọn (có thể cập nhật từng phần)
 * - Cập nhật được thực hiện atomically
 * - Yêu cầu quyền: pharmacist
 *
 * @param id - ID của phiếu cần cập nhật (UUID, bắt buộc)
 * @param payload - Dữ liệu cập nhật (ít nhất 1 trường phải được cung cấp)
 * @param payload.value - Giá trị phiếu mới (VND, tùy chọn)
 * @param payload.note - Cập nhật ghi chú (tùy chọn)
 * @param payload.items - Danh sách items để thêm/cập nhật (tùy chọn, mục không có sẽ bị xóa)
 * @param payload.items[].medicineID - ID thuốc (bắt buộc nếu items được cung cấp)
 * @param payload.items[].quantity - Số lượng mới (bắt buộc nếu items được cung cấp, phải > 0)
 * @param payload.items[].note - Ghi chú item (tùy chọn)
 * @returns Promise<UpdateImexLogResponse> - Phiếu đã cập nhật với chi tiết đầy đủ
 * @throws Error nếu phiếu không tồn tại (404), dữ liệu không hợp lệ (400), không authorized (401) hoặc lỗi máy chủ (500)
 *
 * @example
 * // Cập nhật giá trị và ghi chú
 * const response = await updateImexLog('550e8400-e29b-41d4-a716-446655440000', {
 *   value: 550000,
 *   note: 'Nhập từ nhà cung cấp B'
 * });
 * console.log(response.data.value); // 550000
 *
 * @example
 * // Thêm hoặc cập nhật items (items không trong danh sách sẽ bị xóa)
 * const response = await updateImexLog('550e8400-e29b-41d4-a716-446655440000', {
 *   items: [
 *     { medicineID: 1, quantity: 120, note: 'Kiểm tra QC' },
 *     { medicineID: 3, quantity: 75 }
 *   ]
 * });
 * console.log(response.data.details); // Danh sách items đã cập nhật
 */
export const updateImexLog = async (
  id: string,
  payload: UpdateImexLogPayload
): Promise<UpdateImexLogResponse> => {
  const response = await apiClient.patch<UpdateImexLogResponse>(
    `/medicine/imex/${id}`,
    payload
  );
  return response.data;
};

/**
 * Xóa phiếu nhập xuất thuốc (Delete Imex Log)
 *
 * @description
 * Xóa toàn bộ phiếu nhập/xuất và các mục liên quan.
 * - Tồn kho sẽ tự động khôi phục về trạng thái trước khi phiếu được tạo (reverse transaction)
 * - Hành động này không thể hoàn tác
 * - Xóa được thực hiện atomically
 * - Yêu cầu quyền: pharmacist
 *
 * @param id - ID của phiếu cần xóa (UUID, bắt buộc)
 * @returns Promise<DeleteImexLogResponse> - Thông báo xóa thành công
 * @throws Error nếu phiếu không tồn tại (404), ID không hợp lệ (400), không authorized (401) hoặc lỗi máy chủ (500)
 *
 * @example
 * const response = await deleteImexLog('550e8400-e29b-41d4-a716-446655440000');
 * console.log(response.message); // 'Imex log deleted successfully'
 */
export const deleteImexLog = async (
  id: string
): Promise<DeleteImexLogResponse> => {
  const response = await apiClient.delete<DeleteImexLogResponse>(
    `/medicine/imex/${id}`
  );
  return response.data;
};

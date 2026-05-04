import { apiClient } from "./axios";

/**
 * Loại dữ liệu cho phản hồi tạo medicine ticket
 * @property ticketID - ID duy nhất của vé (UUID)
 * @property orderNum - Số thứ tự của vé trong ngày hôm đó
 * @property status - Trạng thái vé (pending hoặc done)
 * @property prescription - Thông tin đơn thuốc liên quan
 */
interface CreateMedicineTicketResponse {
  message: string;
  data: {
    ticketID: string;
    orderNum: number;
    status: "pending" | "done";
    prescription: {
      prescriptionDisplayID: string;
      createdAt: string;
    };
  };
}

/**
 * Loại dữ liệu cho phản hồi lấy danh sách medicine ticket
 * @property ticketID - ID duy nhất của vé (UUID)
 * @property prescriptionID - ID của đơn thuốc (UUID) - dùng cho API calls và navigation
 * @property prescriptionDisplayID - Mã đơn thuốc hiển thị - dùng cho hiển thị giao diện
 * @property patientName - Tên bệnh nhân
 * @property orderNum - Số thứ tự của vé trong hàng chờ
 * @property status - Trạng thái vé (pending hoặc done)
 * @property roomName - Tên phòng dược
 * @property createdAt - Thời gian tạo vé
 */
export interface MedicineTicket {
  ticketID: string;
  prescriptionID: string;
  prescriptionDisplayID: string;
  patientName: string;
  orderNum: number;
  status: "pending" | "done";
  roomName: string;
  createdAt: string;
}

interface GetMedicineTicketsResponse {
  message: string;
  data: MedicineTicket[];
}

/**
 * Loại dữ liệu cho phản hồi cập nhật trạng thái medicine ticket
 * @property ticketID - ID duy nhất của vé (UUID)
 * @property orderNum - Số thứ tự của vé
 * @property status - Trạng thái vé mới (pending hoặc done)
 * @property prescriptionID - ID của đơn thuốc (UUID)
 */
interface UpdateMedicineTicketStatusResponse {
  message: string;
  data: {
    ticketID: string;
    orderNum: number;
    status: "pending" | "done";
    prescriptionID: string;
  };
}

/**
 * Tạo một vé thuốc mới (Create Medicine Ticket)
 *
 * @description
 * Tạo một vé phía dược mới với prescriptionDisplayID.
 * - Hệ thống sẽ tự động giải quyết prescriptionID từ prescriptionDisplayID
 * - Số thứ tự (orderNum) được tính toán tự động dựa trên các vé hiện có trong ngày hôm nay
 * - roomID được giải quyết từ tài khoản nhà dược hiện tại
 * - Trạng thái mặc định là "pending"
 *
 * @param prescriptionDisplayID - Mã đơn thuốc hiển thị (bắt buộc)
 * @returns Promise<CreateMedicineTicketResponse> - Đối tượng chứa thông tin vé mới được tạo
 * @throws Error nếu prescriptionDisplayID không hợp lệ hoặc lỗi máy chủ
 *
 * @example
 * const response = await createMedicineTicket("RX-2026-001");
 * console.log(response.data.ticketID); // UUID của vé mới tạo
 * console.log(response.data.orderNum); // Ví dụ: 5
 */
export const createMedicineTicket = async (
  prescriptionDisplayID: string
): Promise<CreateMedicineTicketResponse> => {
  const response = await apiClient.post<CreateMedicineTicketResponse>(
    "/medicine/tickets",
    {
      prescriptionDisplayID,
    }
  );
  return response.data;
};

/**
 * Lấy danh sách vé thuốc theo ngày (Get Medicine Tickets)
 *
 * @description
 * Lấy danh sách các vé thuốc (hàng chờ chờ dược).
 * - Ngày lọc phải được gửi qua query params (không phải trong request body)
 * - Được dùng để hiển thị trên màn hình TV phòng chờ và màn hình máy tính của nhà dược
 * - Nếu không cung cấp ngày, hệ thống sẽ mặc định lấy hôm nay
 *
 * @param date - Ngày cần lấy dữ liệu (định dạng YYYY-MM-DD). Nếu không cung cấp, mặc định là hôm nay
 * @returns Promise<GetMedicineTicketsResponse> - Mảng chứa danh sách các vé thuốc
 * @throws Error nếu định dạng ngày không hợp lệ hoặc lỗi máy chủ
 *
 * @example
 * // Lấy vé thuốc hôm nay
 * const response = await getMedicineTickets();
 * console.log(response.data); // Mảng các vé thuốc
 *
 * @example
 * // Lấy vé thuốc của một ngày cụ thể
 * const response = await getMedicineTickets("2026-02-24");
 * console.log(response.data); // Mảng các vé thuốc của ngày 2026-02-24
 */
export const getMedicineTickets = async (
  date?: string
): Promise<GetMedicineTicketsResponse> => {
  const response = await apiClient.get<GetMedicineTicketsResponse>(
    "/medicine/tickets",
    {
      params: date ? { date } : {},
    }
  );
  return response.data;
};

/**
 * Cập nhật trạng thái vé thuốc (Update Medicine Ticket Status)
 *
 * @description
 * Cập nhật trạng thái của một vé thuốc.
 * - Được sử dụng bởi nhà dược để đánh dấu vé là "done" khi đã cấp phát thuốc
 * - Chỉ các trạng thái hợp lệ là "pending" hoặc "done"
 *
 * @param ticketID - ID của vé cần cập nhật (UUID, bắt buộc)
 * @param status - Trạng thái mới cho vé ('pending' hoặc 'done', bắt buộc)
 * @returns Promise<UpdateMedicineTicketStatusResponse> - Đối tượng chứa thông tin vé đã cập nhật
 * @throws Error nếu ticketID không hợp lệ, vé không tồn tại, hoặc lỗi máy chủ
 *
 * @example
 * const response = await updateMedicineTicketStatus(
 *   "550e8400-e29b-41d4-a716-446655440000",
 *   "done"
 * );
 * console.log(response.data.status); // "done"
 */
export const updateMedicineTicketStatus = async (
  ticketID: string,
  status: "pending" | "done"
): Promise<UpdateMedicineTicketStatusResponse> => {
  const response = await apiClient.patch<UpdateMedicineTicketStatusResponse>(
    `/medicine/tickets/${ticketID}/status`,
    {
      status,
    }
  );
  return response.data;
};

/**
 * Loại dữ liệu cho phản hồi xuất thuốc theo vé thuốc
 * @property ticketID - ID duy nhất của vé (UUID)
 * @property status - Trạng thái vé (done)
 * @property prescriptionID - ID của đơn thuốc (UUID)
 * @property prescriptionDisplayID - Mã đơn thuốc hiển thị
 * @property imexID - ID của phiếu xuất thuốc (UUID)
 */
interface DispenseMedicineResponse {
  message: string;
  data: {
    ticketID: string;
    status: "done";
    prescriptionID: string;
    prescriptionDisplayID: string;
    imexID: string;
  };
}

/**
 * Xuất thuốc cho một vé thuốc (Dispense Medicine)
 *
 * @description
 * Xuất thuốc cho một medicine ticket.
 * - Hệ thống sẽ kiểm tra tồn kho của toàn bộ thuốc trong prescription tương ứng
 * - Nếu đủ tồn kho, hệ thống sẽ tạo phiếu xuất thuốc, trừ tồn kho, cập nhật medicine ticket và prescription sang `done`
 * - Nếu thiếu thuốc, request sẽ bị từ chối và không có thay đổi nào được ghi vào database
 * - Chỉ nhà dược mới có thể truy cập endpoint này
 *
 * @param ticketID - ID của vé thuốc cần xuất (UUID, bắt buộc)
 * @returns Promise<DispenseMedicineResponse> - Đối tượng chứa thông tin xuất thuốc thành công
 * @throws Error - 400: Invalid ticket id hoặc insufficient stock
 * @throws Error - 401: Unauthorized (missing or invalid access token)
 * @throws Error - 403: Forbidden (only pharmacists can access this endpoint)
 * @throws Error - 404: Medicine ticket hoặc prescription không tìm thấy
 * @throws Error - 409: Medicine ticket hoặc prescription đã hoàn thành
 * @throws Error - 500: Server error
 *
 * @example
 * const response = await dispenseMedicine("550e8400-e29b-41d4-a716-446655440000");
 * console.log(response.data.ticketID); // UUID của vé
 * console.log(response.data.status); // "done"
 * console.log(response.data.imexID); // UUID của phiếu xuất thuốc
 */
export const dispenseMedicine = async (
  ticketID: string
): Promise<DispenseMedicineResponse> => {
  const response = await apiClient.post<DispenseMedicineResponse>(
    "/medicine/tickets/dispense",
    {},
    {
      params: {
        id: ticketID,
      },
    }
  );
  return response.data;
};

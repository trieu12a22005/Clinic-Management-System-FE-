import { apiClient } from './axios';

/**
 * Trạng thái lịch khám.
 */
export type AppointmentStatus = 'pending' | 'approved' | 'cancelled';

/**
 * Trạng thái tiền cọc của lịch khám.
 */
export type AppointmentDepositStatus = 'paid' | 'unpaid' | 'refunded';

/**
 * Loại lịch khám.
 */
export type AppointmentType = 'examine' | 're_examine';

/**
 * Thông tin tài khoản cơ bản đi kèm bệnh nhân hoặc nhân viên.
 */
export interface AppointmentAccount {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Thông tin bệnh nhân trong dữ liệu lịch khám.
 */
export interface AppointmentPatient {
  patientID?: string;
  patientDisplayID?: string;
  account?: AppointmentAccount;
  [key: string]: unknown;
}

/**
 * Thông tin chuyên khoa trong dữ liệu lịch khám.
 */
export interface AppointmentFaculty {
  facultyID?: string;
  facultyName?: string;
  [key: string]: unknown;
}

/**
 * Thông tin phòng khám trong dữ liệu lịch khám.
 */
export interface AppointmentRoom {
  roomID?: string;
  roomName?: string;
  faculty?: AppointmentFaculty;
  [key: string]: unknown;
}

/**
 * Thông tin nhân viên duyệt lịch khám.
 */
export interface AppointmentStaff {
  staffID?: string;
  account?: AppointmentAccount;
  [key: string]: unknown;
}

/**
 * Cấu trúc lịch khám cơ bản được trả về từ API.
 */
export interface AppointmentItem {
  appointmentID: string;
  appointmentDisplayID?: string;
  status: AppointmentStatus;
  depositStatus?: AppointmentDepositStatus;
  scheduleDate: string;
  appointmentType?: AppointmentType | string;
  patient?: AppointmentPatient;
  room?: AppointmentRoom | null;
  faculty?: AppointmentFaculty | null;
  approvedByStaff?: AppointmentStaff | null;
  [key: string]: unknown;
}

/**
 * Chi tiết lịch khám bao gồm phiếu tiếp nhận và ghi chép khám liên quan.
 */
export interface AppointmentDetail extends AppointmentItem {
  enterTickets?: unknown[];
  examineLogs?: unknown[];
}

/**
 * Request tạo lịch khám mới.
 * @property firstName - Tên bệnh nhân (bắt buộc)
 * @property lastName - Họ bệnh nhân (bắt buộc)
 * @property phoneNumber - Số điện thoại để tìm bệnh nhân hiện tại hoặc tự tạo mới (bắt buộc)
 * @property email - Email bệnh nhân (tùy chọn)
 * @property appointmentType - Loại khám: khám mới hoặc tái khám (tùy chọn, mặc định backend thường là `examine`)
 * @property scheduleDate - Ngày giờ lịch khám theo ISO 8601 (bắt buộc)
 * @property roomID - ID phòng khám muốn gán trước (tùy chọn)
 * @property facultyID - ID chuyên khoa (bắt buộc)
 */
export interface CreateAppointmentPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  birthDate?: string;
  address?: string;
  appointmentType?: AppointmentType;
  scheduleDate: string;
  roomID?: string;
  facultyID: string;
}

/**
 * Response tạo lịch khám.
 * @property appointment - Lịch khám vừa tạo, bao gồm thông tin bệnh nhân, chuyên khoa và phòng khám
 * @property message - Thông báo từ backend nếu có
 */
export interface CreateAppointmentResponse {
  appointment: AppointmentItem;
  message?: string;
}

/**
 * Tham số query khi lấy danh sách lịch khám.
 * @property status - Lọc theo trạng thái lịch khám
 * @property facultyID - Lọc theo ID chuyên khoa
 * @property patientID - Lọc theo ID bệnh nhân
 * @property scheduleDate - Lọc theo ngày khám định dạng YYYY-MM-DD
 */
export interface GetAppointmentsParams {
  status?: AppointmentStatus;
  facultyID?: string;
  patientID?: string;
  scheduleDate?: string;
}

/**
 * Response lấy danh sách lịch khám.
 * @property appointments - Danh sách lịch khám thỏa điều kiện lọc
 * @property message - Thông báo từ backend nếu có
 */
export interface GetAppointmentsResponse {
  appointments: AppointmentItem[];
  message?: string;
}

/**
 * Response lấy chi tiết một lịch khám.
 * @property appointment - Dữ liệu chi tiết của lịch khám gồm bệnh nhân, chuyên khoa, phòng khám, người duyệt, enter tickets và examine logs
 * @property message - Thông báo từ backend nếu có
 */
export interface GetAppointmentByIdResponse {
  appointment: AppointmentDetail;
  message?: string;
}

/**
 * Request cập nhật lịch khám.
 * @property status - Trạng thái lịch khám mới
 * @property depositStatus - Trạng thái tiền cọc mới
 * @property patientID - ID bệnh nhân cần gán lại
 * @property facultyID - ID chuyên khoa cần cập nhật
 * @property roomID - ID phòng khám cần cập nhật
 * @property scheduleDate - Ngày khám mới định dạng YYYY-MM-DD
 */
export interface UpdateAppointmentPayload {
  status?: AppointmentStatus;
  depositStatus?: AppointmentDepositStatus;
  patientID?: string;
  facultyID?: string;
  roomID?: string;
  scheduleDate?: string;
}

/**
 * Response cập nhật lịch khám.
 * @property message - Thông báo kết quả cập nhật
 * @property appointment - Lịch khám sau khi được cập nhật
 */
export interface UpdateAppointmentResponse {
  message: string;
  appointment: AppointmentDetail;
}

/**
 * Request duyệt lịch khám.
 * @property approvedBy - ID nhân viên thực hiện duyệt (bắt buộc)
 * @property roomID - ID phòng khám muốn gán khi duyệt (tùy chọn)
 */
export interface ApproveAppointmentPayload {
  approvedBy: string;
  roomID?: string;
}

/**
 * Response duyệt lịch khám.
 * @property message - Thông báo duyệt thành công
 * @property appointment - Lịch khám sau khi chuyển sang trạng thái approved
 */
export interface ApproveAppointmentResponse {
  message: string;
  appointment: AppointmentItem & {
    approvedBy?: string;
    roomID?: string;
  };
}

/**
 * Request hủy lịch khám.
 * @property reason - Lý do hủy lịch khám (tùy chọn)
 */
export interface CancelAppointmentPayload {
  reason?: string;
}

/**
 * Response hủy lịch khám.
 * @property message - Thông báo hủy lịch khám và gửi email thành công
 * @property appointment - Lịch khám sau khi chuyển sang trạng thái cancelled
 */
export interface CancelAppointmentResponse {
  message: string;
  appointment: AppointmentItem & {
    reason?: string;
  };
}

/**
 * Response xóa một lịch khám.
 * @property message - Thông báo xóa thành công
 */
export interface DeleteAppointmentResponse {
  message: string;
}

/**
 * Request xóa nhiều lịch khám.
 * @property appointmentIds - Mảng ID lịch khám cần xóa, tối thiểu 1 phần tử
 */
export interface DeleteManyAppointmentsPayload {
  appointmentIds: string[];
}

/**
 * Response xóa nhiều lịch khám.
 * @property message - Thông báo kết quả xóa
 * @property deletedCount - Số lượng lịch khám đã được xóa thành công
 */
export interface DeleteManyAppointmentsResponse {
  message: string;
  deletedCount: number;
}

export class AppointmentApi {
  /**
   * Tạo lịch khám mới tại `/admin/appointments`.
   *
   * @description
   * Tạo lịch khám mới. Hệ thống tự động tạo bệnh nhân nếu chưa tồn tại (dựa vào số điện thoại).
   * Nếu bệnh nhân đã tồn tại, sẽ sử dụng bệnh nhân hiện tại.
   * Tự động sinh mã lịch khám (`appointmentDisplayID`) và mã bệnh nhân tương ứng.
   *
   * @param payload - Các trường bắt buộc: `firstName`, `lastName`, `phoneNumber`, `facultyID`, `scheduleDate`.
   *                   Các trường tùy chọn: `email`, `appointmentType` (mặc định: examine), `roomID`.
   *
   * @returns Promise<CreateAppointmentResponse> - Response 201
   *   - `appointment`: Lịch khám vừa tạo chứa `appointmentID`, `appointmentDisplayID`, `status` (pending),
   *     `depositStatus` (unpaid), `scheduleDate`, `appointmentType`, dữ liệu `patient`, `faculty`, `room`
   *
   * @throws 400 - Yêu cầu không hợp lệ (thiếu trường bắt buộc)
   * @throws 404 - Không tìm thấy chuyên khoa hoặc phòng khám
   * @throws 500 - Lỗi máy chủ
   */
  async createAppointment(
    payload: CreateAppointmentPayload
  ): Promise<CreateAppointmentResponse> {
    const response = await apiClient.post<CreateAppointmentResponse>(
      '/admin/appointments',
      payload
    );
    return response.data;
  }

  /**
   * Lấy danh sách lịch khám từ `/admin/appointments`.
   *
   * @description
   * Truy xuất danh sách các lịch khám với các tùy chọn lọc.
   * Có thể lọc theo trạng thái, chuyên khoa, bệnh nhân, hoặc ngày khám.
   * Kết quả được sắp xếp theo ngày khám giảm dần.
   *
   * @param params - Query parameters (tất cả tùy chọn):
   *   - `status`: Lọc theo trạng thái `pending | approved | cancelled`
   *   - `facultyID`: Lọc theo ID chuyên khoa
   *   - `patientID`: Lọc theo ID bệnh nhân
   *   - `scheduleDate`: Lọc theo ngày khám định dạng `YYYY-MM-DD`
   *
   * @returns Promise<GetAppointmentsResponse> - Response 200
   *   - `appointments`: Mảng lịch khám chứa thông tin:
   *     `appointmentID`, `appointmentDisplayID`, `status`, `depositStatus`, `scheduleDate`, `appointmentType`,
   *     `patient` (với `patientID`, `account`), `faculty` (với `facultyID`, `facultyName`),
   *     `room` (với `roomID`, `roomName`), `approvedByStaff` (nếu đã duyệt)
   *
   * @throws 400 - Yêu cầu không hợp lệ
   * @throws 401 - Không được phép (thiếu hoặc token không hợp lệ)
   * @throws 500 - Lỗi máy chủ
   */
  async getAppointments(
    params?: GetAppointmentsParams
  ): Promise<GetAppointmentsResponse> {
    const response = await apiClient.get<GetAppointmentsResponse>(
      '/admin/appointments',
      {
        params,
      }
    );
    return response.data;
  }

  /**
   * Lấy thông tin chi tiết lịch khám từ `/admin/appointments/{id}`.
   *
   * @description
   * Truy xuất thông tin chi tiết của một lịch khám cụ thể bao gồm:
   * - Thông tin bệnh nhân (tên, số điện thoại, email, ...)
   * - Thông tin chuyên khoa
   * - Thông tin phòng khám
   * - Nhân viên duyệt lịch khám
   * - Danh sách phiếu tiếp nhận liên quan
   * - Danh sách ghi chép khám liên quan
   *
   * @param appointmentID - ID lịch khám (UUID)
   *
   * @returns Promise<GetAppointmentByIdResponse> - Response 200
   *   - `appointment`: Chi tiết lịch khám chứa `appointmentID`, `appointmentDisplayID`, `status`, `depositStatus`,
   *     `scheduleDate`, `appointmentType`, `patient`, `faculty`, `room`, `approvedByStaff`,
   *     `enterTickets` (mảng phiếu tiếp nhận), `examineLogs` (mảng ghi chép khám)
   *
   * @throws 400 - Yêu cầu không hợp lệ (thiếu ID lịch khám)
   * @throws 401 - Không được phép (thiếu hoặc token không hợp lệ)
   * @throws 404 - Không tìm thấy lịch khám
   * @throws 500 - Lỗi máy chủ
   */
  async getAppointmentById(
    appointmentID: string
  ): Promise<GetAppointmentByIdResponse> {
    const response = await apiClient.get<GetAppointmentByIdResponse>(
      `/admin/appointments/${appointmentID}`
    );
    return response.data;
  }

  /**
   * Cập nhật thông tin lịch khám tại `/admin/appointments/{id}`.
   *
   * @description
   * Cập nhật các thông tin của lịch khám như trạng thái, phòng khám, bệnh nhân, chuyên khoa, ngày khám, v.v.
   * Chỉ cập nhật các trường được cung cấp, các trường khác không thay đổi (partial update).
   *
   * @param appointmentID - ID lịch khám (UUID)
   * @param payload - Các trường cần cập nhật (tất cả tùy chọn):
   *   - `status`: Trạng thái `pending | approved | cancelled`
   *   - `depositStatus`: Trạng thái tiền cọc `paid | unpaid | refunded`
   *   - `patientID`: ID bệnh nhân
   *   - `facultyID`: ID chuyên khoa
   *   - `roomID`: ID phòng khám
   *   - `scheduleDate`: Ngày khám định dạng `YYYY-MM-DD`
   *
   * @returns Promise<UpdateAppointmentResponse> - Response 200
   *   - `message`: "Update successful" hoặc thông báo tương tự
   *   - `appointment`: Lịch khám sau khi được cập nhật
   *
   * @throws 400 - Yêu cầu không hợp lệ
   * @throws 401 - Không được phép
   * @throws 404 - Không tìm thấy lịch khám, bệnh nhân, chuyên khoa hoặc phòng khám
   * @throws 500 - Lỗi máy chủ
   */
  async updateAppointmentById(
    appointmentID: string,
    payload: UpdateAppointmentPayload
  ): Promise<UpdateAppointmentResponse> {
    const response = await apiClient.patch<UpdateAppointmentResponse>(
      `/admin/appointments/${appointmentID}`,
      payload
    );
    return response.data;
  }

  /**
   * Duyệt lịch khám tại `/admin/appointments/{id}/approve`.
   *
   * @description
   * Duyệt lịch khám và thay đổi trạng thái từ `pending` thành `approved`.
   * Có thể gán phòng khám khi duyệt lịch khám.
   *
   * @param appointmentID - ID lịch khám (UUID)
   * @param payload - Request body (bắt buộc):
   *   - `approvedBy`: ID nhân viên duyệt (bắt buộc)
   *   - `roomID`: ID phòng khám (tùy chọn)
   *
   * @returns Promise<ApproveAppointmentResponse> - Response 200
   *   - `message`: "Appointment approved" hoặc thông báo tương tự
   *   - `appointment`: Lịch khám sau khi được duyệt (trạng thái: approved),
   *     chứa thông tin `appointmentID`, `status`, `approvedBy`, `roomID`
   *
   * @throws 400 - Yêu cầu không hợp lệ (thiếu approvedBy)
   * @throws 401 - Không được phép
   * @throws 404 - Không tìm thấy lịch khám, nhân viên hoặc phòng khám
   * @throws 500 - Lỗi máy chủ
   */
  async approveAppointment(
    appointmentID: string,
    payload: ApproveAppointmentPayload
  ): Promise<ApproveAppointmentResponse> {
    const response = await apiClient.patch<ApproveAppointmentResponse>(
      `/admin/appointments/${appointmentID}/approve`,
      payload
    );
    return response.data;
  }

  /**
   * Hủy lịch khám tại `/admin/appointments/{id}/cancel`.
   *
   * @description
   * Hủy lịch khám và thay đổi trạng thái thành `cancelled`.
   * Gửi email thông báo hủy lịch cho bệnh nhân.
   * Lý do hủy là tùy chọn và sẽ được ghi nhận.
   *
   * @param appointmentID - ID lịch khám (UUID)
   * @param payload - Request body (tùy chọn):
   *   - `reason`: Lý do hủy lịch khám (tùy chọn)
   *
   * @returns Promise<CancelAppointmentResponse> - Response 200
   *   - `message`: "Appointment cancelled and notification email sent" hoặc thông báo tương tự
   *   - `appointment`: Lịch khám sau khi được hủy (trạng thái: cancelled),
   *     chứa thông tin `appointmentID`, `status`, `reason`
   *
   * @throws 400 - Yêu cầu không hợp lệ
   * @throws 401 - Không được phép
   * @throws 404 - Không tìm thấy lịch khám
   * @throws 500 - Lỗi máy chủ
   */
  async cancelAppointment(
    appointmentID: string,
    payload?: CancelAppointmentPayload
  ): Promise<CancelAppointmentResponse> {
    const response = await apiClient.patch<CancelAppointmentResponse>(
      `/admin/appointments/${appointmentID}/cancel`,
      payload ?? {}
    );
    return response.data;
  }

  /**
   * Xóa lịch khám tại `/admin/appointments/{id}`.
   *
   * @description
   * Xóa lịch khám khỏi hệ thống.
   * Chỉ có thể xóa các lịch khám có trạng thái `cancelled` hoặc `pending`.
   * Không thể xóa lịch khám ở trạng thái `approved`.
   *
   * @param appointmentID - ID lịch khám (UUID)
   *
   * @returns Promise<DeleteAppointmentResponse> - Response 200
   *   - `message`: "Appointment deleted successfully" hoặc thông báo tương tự
   *
   * @throws 400 - Yêu cầu không hợp lệ (thiếu ID lịch khám)
   * @throws 401 - Không được phép
   * @throws 404 - Không tìm thấy lịch khám
   * @throws 409 - Xung đột (Không thể xóa lịch khám ở trạng thái approved)
   * @throws 500 - Lỗi máy chủ
   */
  async deleteAppointmentById(
    appointmentID: string
  ): Promise<DeleteAppointmentResponse> {
    const response = await apiClient.delete<DeleteAppointmentResponse>(
      `/admin/appointments/${appointmentID}`
    );
    return response.data;
  }

  /**
   * Xóa nhiều lịch khám tại `/admin/appointments/delete-many`.
   *
   * @description
   * Xóa nhiều lịch khám khỏi hệ thống cùng một lúc.
   * Chỉ xóa được các lịch khám có trạng thái `cancelled` hoặc `pending`.
   * Các lịch khám ở trạng thái `approved` sẽ bị bỏ qua.
   * Nếu một số lịch khám không thể xóa được, sẽ trả về 409 với `deletedCount` là số lịch đã xóa.
   *
   * @param payload - Request body (bắt buộc):
   *   - `appointmentIds`: Mảng ID lịch khám cần xóa (UUID array, tối thiểu 1 phần tử)
   *
   * @returns Promise<DeleteManyAppointmentsResponse> - Response 200
   *   - `message`: "Appointments deleted successfully" hoặc thông báo tương tự
   *   - `deletedCount`: Số lượng lịch khám được xóa thành công
   *
   * @throws 400 - Yêu cầu không hợp lệ (thiếu appointmentIds)
   * @throws 401 - Không được phép
   * @throws 409 - Xung đột (Một số lịch khám không thể xóa được, nhưng có thể một số khác đã xóa)
   * @throws 500 - Lỗi máy chủ
   */
  async deleteManyAppointments(
    payload: DeleteManyAppointmentsPayload
  ): Promise<DeleteManyAppointmentsResponse> {
    const response = await apiClient.delete<DeleteManyAppointmentsResponse>(
      '/admin/appointments/delete-many',
      {
        data: payload,
      }
    );
    return response.data;
  }
}

const appointmentApi = new AppointmentApi();

export default appointmentApi;

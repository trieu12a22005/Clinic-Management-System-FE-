export const appointmentStatusMap: Record<string, string> = {
  pending: "Đang chờ",
  approved: "Đã duyệt",
  cancelled: "Đã hủy",
};

export const appointmentTypeMap: Record<string, string> = {
  examine: "Khám bệnh",
  re_examine: "Tái khám",
};

// enum collections
const appointmentEnum: Record<string, Record<string, string>> = {
  status: appointmentStatusMap,
  type: appointmentTypeMap,
};

export default appointmentEnum;

export const appointmentStatusColor: Record<string, string> = {
  pending: "warning",
  approved: "success",
  cancelled: "error",
};
export const appointmentTypeColor: Record<string, string> = {
  examine: "blue",
  re_examine: "cyan",
};
// enum collections
const appointmentTags: Record<string, Record<string, string>> = {
  status: appointmentStatusColor,
  type: appointmentTypeColor,
};

export default appointmentTags;

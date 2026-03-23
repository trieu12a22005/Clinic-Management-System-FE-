import { Table } from "antd";
import fieldList from "./List/fieldList";

const data = [
  {
    key: "1",
    appointmentDisplayID: "APPT001",
    patientName: "Nguyễn Văn A",
    appointmentDate: "2024-01-15",
    status: "pending",
    appointmentType: "examine",
  },
  {
    key: "2",
    appointmentDisplayID: "APPT002",
    patientName: "Trần Thị B",
    appointmentDate: "2024-01-20",
    status: "cancelled",
    appointmentType: "examine",
  },
  {
    key: "3",
    appointmentDisplayID: "APPT003",
    patientName: "Phạm Văn C",
    appointmentDate: "2024-01-25",
    status: "approved",
    appointmentType: "examine",
  },
];

function AppointmentPage() {
  return (
    <div className="min-h-screen bg-white p-12 font-sans mx-auto max-w-[var(--maxw)]">
      <h1 className="text-primary text-xl md:text-2xl lg:text-4xl font-bold">Lịch hẹn khám</h1>
      <p className="my-6 text-lg">
        Danh sách lịch hẹn khám của bệnh nhân. Lưu ý chưa triển khai pagination cho table. Khi nào họp làm ơn sửa lại
      </p>
      <Table columns={fieldList} dataSource={data} />
    </div>
  );
}
export default AppointmentPage;

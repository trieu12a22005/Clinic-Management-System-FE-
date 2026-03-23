import ItemOptionsRender from "./ItemOptionsRender";
import ItemStatusRender from "./ItemStatusRender";
import ItemTypeRender from "./ItemTypeRender";

const fieldList = [
  {
    title: "#",
    dataIndex: "appointmentDisplayID",
    key: "appointmentDisplayID",
  },
  {
    title: "Tên bệnh nhân",
    dataIndex: "patientName",
    key: "patientName",
  },
  {
    title: "Loại lịch hẹn",
    dataIndex: "appointmentType",
    key: "appointmentType",
    render: ItemTypeRender,
  },
  {
    title: "Khoa",
    dataIndex: "facultyName",
    key: "facultyName",
  },
  {
    title: "Ngày hẹn",
    dataIndex: "appointmentDate",
    key: "appointmentDate",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: ItemStatusRender,
  },
  {
    title: "",
    key: "action",
    render: ItemOptionsRender,
  },
];

export default fieldList;

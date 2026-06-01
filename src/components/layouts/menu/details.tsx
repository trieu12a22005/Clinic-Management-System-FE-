import type { MenuProps } from "antd";
import {
  ExperimentOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  SettingOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

export const sideBarItems: MenuItem[] = [
  {
    key: "clinical",
    label: "Khám chữa bệnh",
    icon: <ExperimentOutlined />,
    children: [
      {
        key: "/timetable",
        label: <Link to="/timetable">Xem lịch trực</Link>,
      },
      {
        key: "/schedule",
        label: <Link to="/timetable">Quản lý lịch trực</Link>,
      },
      {
        key: "/appointment",
        label: <Link to="/appointment">Lịch hẹn</Link>,
      },
      {
        key: "/waiting-room",
        label: <Link to="/waiting-room">Khám bệnh</Link>,
      },
    ],
  },
  {
    key: "pharmacy",
    label: "Dược sỹ",
    icon: <MedicineBoxOutlined />,
    children: [
      {
        key: "/pharmacy-inventory",
        label: <Link to="/pharmacy-inventory">Quản lý thuốc</Link>,
      },
      {
        key: "/pharmacy-queue",
        label: <Link to="/pharmacy-queue">Phát thuốc</Link>,
      },
    ],
  },

  {
    key: "report",
    label: "Báo cáo thống kê",
    icon: <PieChartOutlined />,
    children: [
      {
        key: "/report",
        label: <Link to="/report">Xem báo cáo</Link>,
      },
    ],
  },
  {
    key: "utilities",
    label: "Tiện ích",
    icon: <SearchOutlined />,
    children: [
      {
        key: "/system-config?config=icd",
        label: <Link to="/system-config?config=icd">Tra cứu mã ICD</Link>,
      },
      {
        key: "/system-config?config=usage",
        label: <Link to="/system-config?config=usage">Tra cứu cách dùng</Link>,
      },
    ],
  },
  {
    key: "system",
    label: "Hệ thống",
    icon: <SettingOutlined />,
    children: [
      {
        key: "/system-config",
        label: <Link to="/system-config">Cấu hình chung</Link>,
      },
      {
        key: "/role",
        label: <Link to="/role">Phân quyền</Link>,
      },
      {
        key: "/account",
        label: <Link to="/account">Quản lý tài khoản</Link>,
      },
    ],
  },
];

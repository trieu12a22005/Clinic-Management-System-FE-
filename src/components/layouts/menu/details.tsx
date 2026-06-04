import type { MenuProps } from "antd";
import {
  ExperimentOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  SettingOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMemo, type ReactNode } from "react";
import { useCheckPermission } from "@/hooks/useCheckPermission";

type MenuItem = Required<MenuProps>["items"][number];

type FlatMenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  to?: string;
  requiredPermissions?: string[];
};

const flatMenuItems: FlatMenuItem[] = [
  {
    key: "clinical",
    label: "Khám chữa bệnh",
    icon: <ExperimentOutlined />,
  },
  {
    key: "clinical/timetable",
    label: "Xem lịch trực",
    to: "/timetable",
    requiredPermissions: ["timetable.view"],
  },
  {
    key: "clinical/schedule",
    label: "Quản lý lịch trực",
    to: "/timetable",
    requiredPermissions: ["timetable.update"],
  },
  {
    key: "clinical/appointment",
    label: "Lịch hẹn",
    to: "/appointment",
    requiredPermissions: ["appointment.view"],
  },
  {
    key: "clinical/waiting-room",
    label: "Khám bệnh",
    to: "/waiting-room",
    requiredPermissions: ["ticket.view_all"],
  },
  {
    key: "pharmacy",
    label: "Dược sỹ",
    icon: <MedicineBoxOutlined />,
  },
  {
    key: "pharmacy/pharmacy-inventory",
    label: "Quản lý thuốc",
    to: "/pharmacy-inventory",
    requiredPermissions: ["medicine.add", "medicine.delete", "medicine.update"],
  },
  {
    key: "pharmacy/pharmacy-queue",
    label: "Phát thuốc",
    to: "/pharmacy-queue",
    requiredPermissions: ["medicine_ticket.view_all"],
  },
  {
    key: "report",
    label: "Báo cáo thống kê",
    icon: <PieChartOutlined />,
  },
  {
    key: "report/report",
    label: "Xem báo cáo",
    to: "/report",
    requiredPermissions: ["report.view"],
  },
  {
    key: "utilities",
    label: "Tiện ích",
    icon: <SearchOutlined />,
  },
  {
    key: "utilities/system-config-icd",
    label: "Tra cứu mã ICD",
    to: "/system-config?config=icd",
  },
  {
    key: "system",
    label: "Hệ thống",
    icon: <SettingOutlined />,
  },
  {
    key: "system/system-config",
    label: "Cấu hình chung",
    to: "/system-config",
  },
  {
    key: "system/role",
    label: "Phân quyền",
    to: "/role",
    requiredPermissions: ["role.manage"],
  },
  {
    key: "system/account",
    label: "Quản lý tài khoản",
    to: "/account",
    requiredPermissions: ["account.view"],
  },
];

const splitModuleKey = (key: string) => {
  const [moduleKey, linkKey] = key.split("/", 2);

  return { moduleKey, linkKey };
};

const buildMenuItems = (hasPermission: (requiredPermissions: string[]) => boolean): MenuItem[] => {
  const moduleMap = new Map<
    string,
    {
      module: FlatMenuItem | null;
      children: Array<MenuItem | null>;
    }
  >();

  for (const item of flatMenuItems) {
    const { moduleKey, linkKey } = splitModuleKey(item.key);
    const group = moduleMap.get(moduleKey) ?? { module: null, children: [] };

    if (!linkKey) {
      group.module = item;
      moduleMap.set(moduleKey, group);
      continue;
    }

    const isAllowed = item.requiredPermissions ? hasPermission(item.requiredPermissions) : true;
    const child = isAllowed
      ? ({
          key: item.key,
          label: item.to ? <Link to={item.to}>{item.label}</Link> : item.label,
        } as MenuItem)
      : null;

    group.children.push(child);
    moduleMap.set(moduleKey, group);
  }

  const menuItems: MenuItem[] = [];

  for (const [moduleKey, group] of moduleMap) {
    const children = group.children.filter((child): child is MenuItem => Boolean(child));

    if (!children.length || !group.module) {
      continue;
    }

    menuItems.push({
      key: moduleKey,
      label: group.module.label,
      icon: group.module.icon,
      children,
    });
  }

  return menuItems;
};

export function useSidebarItem() {
  const { hasPermission } = useCheckPermission();

  return useMemo(() => buildMenuItems(hasPermission), [hasPermission]);
}

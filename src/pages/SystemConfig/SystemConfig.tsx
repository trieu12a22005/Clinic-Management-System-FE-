import { Tabs, Typography } from "antd";
import { SettingOutlined, AppstoreOutlined, ExperimentOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { ConfigTab } from "./components/ConfigTab";
import { UnitTab } from "./components/UnitTab";
import { UsageTab } from "./components/UsageTab";
import { DiseaseTab } from "./components/DiseaseTab";
import HasPermission from "@/components/HasPermission";

const { Title } = Typography;
// AI model quèn code ra cái này đây. Không phải claude sonnet gì gì đó đâu.
const configTabs = [
  {
    key: "configs",
    icon: <SettingOutlined />,
    text: "Cấu hình chung",
    content: <ConfigTab />,
    permissions: ["system.manage"],
  },
  {
    key: "units",
    icon: <AppstoreOutlined />,
    text: "Đơn vị thuốc",
    content: <UnitTab />,
    permissions: ["medicine.view", "medicine.add", "medicine.update", "imex.create", "imex.update", "ticket.update"],
  },
  {
    key: "usages",
    icon: <ExperimentOutlined />,
    text: "Cách dùng thuốc",
    content: <UsageTab />,
    permissions: ["medicine.view", "medicine.add", "medicine.update", "imex.create", "imex.update", "ticket.update"],
  },
  {
    key: "diseases",
    icon: <MedicineBoxOutlined />,
    text: "Loại bệnh (ICD-10)",
    content: <DiseaseTab />,
    permissions: ["ticket.update", "system.manage"],
  },
];
const SystemConfig = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 px-8 py-6 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <SettingOutlined className="text-white text-xl" />
            </div>
            <div>
              <Title level={4} className="!text-white !mb-0">
                Cấu hình hệ thống & Dược phẩm
              </Title>
              <p className="text-slate-300 text-sm">Quản lý các tham số vận hành, đơn vị và cách dùng thuốc</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Tabs
          defaultActiveKey="configs"
          type="card"
          size="large"
          items={configTabs.map(({ key, icon, text, content, permissions }) => {
            if (permissions && permissions.length > 0) {
              content = (
                <HasPermission
                  requiredPermissions={permissions}
                  fallback={<>Bạn không có quyền truy cập chức năng này</>}
                >
                  {content}
                </HasPermission>
              );
            }
            return {
              key,
              label: (
                <span className="flex items-center gap-2">
                  {icon}
                  {text}
                </span>
              ),
              children: <div className="mt-4">{content}</div>,
            };
          })}
        />
      </div>
    </div>
  );
};

export default SystemConfig;

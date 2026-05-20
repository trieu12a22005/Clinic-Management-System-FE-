import { Tabs, Typography } from 'antd';
import { SettingOutlined, AppstoreOutlined, ExperimentOutlined } from '@ant-design/icons';
import { ConfigTab } from './components/ConfigTab';
import { UnitTab } from './components/UnitTab';
import { UsageTab } from './components/UsageTab';

const { Title } = Typography;

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
                            <p className="text-slate-300 text-sm">
                                Quản lý các tham số vận hành, đơn vị và cách dùng thuốc
                            </p>
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
                    items={[
                        {
                            key: 'configs',
                            label: (
                                <span className="flex items-center gap-2">
                                    <SettingOutlined />
                                    Cấu hình chung
                                </span>
                            ),
                            children: <div className="mt-4"><ConfigTab /></div>,
                        },
                        {
                            key: 'units',
                            label: (
                                <span className="flex items-center gap-2">
                                    <AppstoreOutlined />
                                    Đơn vị thuốc
                                </span>
                            ),
                            children: <div className="mt-4"><UnitTab /></div>,
                        },
                        {
                            key: 'usages',
                            label: (
                                <span className="flex items-center gap-2">
                                    <ExperimentOutlined />
                                    Cách dùng thuốc
                                </span>
                            ),
                            children: <div className="mt-4"><UsageTab /></div>,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default SystemConfig;
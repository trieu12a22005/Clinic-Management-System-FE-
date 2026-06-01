import { useState } from "react";
import { Button } from "antd";
import { PrinterOutlined, FileTextOutlined } from "@ant-design/icons";
import BM1 from "./components/BM1";
import BM5_1 from "./components/BM5_1";
import BM5_2 from "./components/BM5_2";

const TABS = [
    { key: "bm1", label: "BM1", title: "Danh Sách Khám Bệnh", color: "bg-indigo-500" },
    { key: "bm5_1", label: "BM5.1", title: "Báo Cáo Doanh Thu", color: "bg-teal-500" },
    { key: "bm5_2", label: "BM5.2", title: "Báo Cáo Sử Dụng Thuốc", color: "bg-rose-500" },
];

const COMPONENTS: Record<string, JSX.Element> = {
    bm1: <BM1 />,
    bm5_1: <BM5_1 />,
    bm5_2: <BM5_2 />,
};

const Report = () => {
    const [activeTab, setActiveTab] = useState("bm1");

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white print:min-h-0 font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-6 shadow-lg print:hidden">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FileTextOutlined className="text-white text-2xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-wide">Quản Lý Biểu Mẫu</h1>
                            <p className="text-blue-200 text-sm">Hệ thống quản lý biểu mẫu phòng khám</p>
                        </div>
                    </div>
                    <Button
                        icon={<PrinterOutlined />}
                        onClick={() => window.print()}
                        className="bg-white text-blue-700 border-0 font-semibold hover:bg-blue-50"
                    >
                        In biểu mẫu
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 print:p-0 print:m-0 print:max-w-none">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8 print:hidden">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 border ${
                                activeTab === tab.key
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                            }`}
                        >
                            {tab.label}
                            <span className={`ml-2 text-xs font-normal hidden sm:inline ${activeTab === tab.key ? "text-indigo-200" : "text-gray-400"}`}>
                                {tab.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Active Component */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:border-none print:shadow-none print:rounded-none">
                    {COMPONENTS[activeTab]}
                </div>

            </div>
        </div>
    );
};

export default Report;
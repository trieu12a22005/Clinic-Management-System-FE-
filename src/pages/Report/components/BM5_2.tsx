import { useState } from "react";
import { DatePicker, Table, Alert } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { UseBM5_2 } from "../useReport";

const { MonthPicker } = DatePicker;

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Thuốc", dataIndex: "thuoc" },
    { title: "Đơn Vị Tính", dataIndex: "donViTinh", width: 130, align: "center" as const },
    { title: "Số Lượng", dataIndex: "soLuong", width: 120, align: "center" as const },
    { title: "Số Lần Dùng", dataIndex: "soLanDung", width: 130, align: "center" as const },
];

const BM5_2 = () => {
    const [month, setMonth] = useState<Dayjs>(dayjs());
    const m = month.month() + 1;
    const y = month.year();

    const { reportData, isLoading, isError } = UseBM5_2(m, y);

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 print:bg-none print:text-black print:border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-rose-500 print:bg-transparent print:border print:border-rose-500 text-white print:text-rose-700 text-xs font-bold px-3 py-1 rounded-full">BM5.2</span>
                    <h2 className="text-white print:text-black font-bold text-lg">Báo Cáo Sử Dụng Thuốc</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 print:hidden">
                    <CalendarOutlined className="text-white text-sm" />
                    <span className="text-white text-xs font-medium">Tháng:</span>
                    <MonthPicker value={month} onChange={(v) => v && setMonth(v)} format="MM/YYYY" size="small" style={{ width: 110 }} allowClear={false} />
                </div>
            </div>
            
            <div className="px-6 py-3 bg-blue-50 print:bg-transparent border-b border-blue-100 text-sm text-gray-500 print:text-black">
                Báo cáo tháng: <strong className="text-blue-700 print:text-black">{month.format("MM/YYYY")}</strong>
            </div>

            {isError && (
                <div className="p-4">
                    <Alert message="Lỗi khi tải dữ liệu báo cáo sử dụng thuốc" type="error" showIcon />
                </div>
            )}

            <Table
                columns={columns}
                dataSource={reportData}
                loading={isLoading}
                rowKey="key"
                pagination={false}
                bordered
                size="middle"
                rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
            />
        </div>
    );
};

export default BM5_2;

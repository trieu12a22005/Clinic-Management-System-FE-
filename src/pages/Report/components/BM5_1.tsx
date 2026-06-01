import { useState } from "react";
import { DatePicker, Table, Alert } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { UseBM5_1 } from "../useReport";

const { MonthPicker } = DatePicker;

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Ngày", dataIndex: "date", width: 130, align: "center" as const },
    { title: "Số Bệnh Nhân", dataIndex: "patientCount", width: 150, align: "center" as const },
    {
        title: "Doanh Thu (VNĐ)", dataIndex: "revenue", align: "right" as const,
        render: (v: number) => v?.toLocaleString("vi-VN") || "0",
    },
    { title: "Tỷ Lệ", dataIndex: "ratio", width: 90, align: "center" as const },
];

const BM5_1 = () => {
    const [month, setMonth] = useState<Dayjs>(dayjs());
    const m = month.month() + 1;
    const y = month.year();

    const { report, isLoading, isError } = UseBM5_1(m, y);
    const data = report?.data || [];

    return (
        <div>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 print:bg-none print:text-black print:border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-teal-500 print:bg-transparent print:border print:border-teal-500 text-white print:text-teal-700 text-xs font-bold px-3 py-1 rounded-full">BM5.1</span>
                    <h2 className="text-white print:text-black font-bold text-lg">Báo Cáo Doanh Thu Theo Tháng</h2>
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
                    <Alert message="Lỗi khi tải dữ liệu báo cáo" type="error" showIcon />
                </div>
            )}

            <Table
                columns={columns}
                dataSource={data}
                loading={isLoading}
                rowKey="stt"
                pagination={false}
                bordered
                size="middle"
                rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                summary={(pageData) => {
                    const total = pageData.reduce((s, r) => s + (r.revenue || 0), 0);
                    const totalPt = pageData.reduce((s, r) => s + (r.patientCount || 0), 0);
                    return (
                        <Table.Summary.Row className="font-bold bg-blue-50">
                            <Table.Summary.Cell index={0} colSpan={2} align="center"><strong>Tổng cộng</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="center"><strong className="text-indigo-700">{totalPt}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right"><strong className="text-green-600">{total.toLocaleString("vi-VN")} VNĐ</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="center"><strong className="text-gray-600">100%</strong></Table.Summary.Cell>
                        </Table.Summary.Row>
                    );
                }}
            />
        </div>
    );
};

export default BM5_1;

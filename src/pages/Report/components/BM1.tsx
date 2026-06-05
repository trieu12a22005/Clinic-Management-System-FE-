import { useState } from "react";
import { DatePicker, Table, Tag, Spin, Alert } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { UseBM1 } from "../useReport";

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Họ Tên", dataIndex: "fullName" },
    {
        title: "Giới Tính", dataIndex: "gender", width: 110, align: "center" as const,
        render: (v: string) => <Tag color={v === "Nam" ? "blue" : "pink"}>{v}</Tag>,
    },
    { title: "Năm Sinh", dataIndex: "birthYear", width: 110, align: "center" as const },
    { title: "Địa Chỉ", dataIndex: "address", render: (v: string) => v || <span className="text-gray-300 italic">—</span> },
];

const BM1 = () => {
    const [date, setDate] = useState<Dayjs>(dayjs());

    const { report, isLoading, isError, error } = UseBM1(date.format("YYYY-MM-DD"));

    return (
        <div>
            {/* Filter bar */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM1</span>
                    <h2 className="text-white font-bold text-lg">Danh Sách Khám Bệnh</h2>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                    <CalendarOutlined className="text-white text-sm" />
                    <span className="text-white text-xs font-medium">Ngày khám:</span>
                    <DatePicker
                        value={date}
                        onChange={(v) => v && setDate(v)}
                        format="DD/MM/YYYY"
                        size="small"
                        style={{ width: 130 }}
                    />
                </div>
            </div>

            {/* Stats strip */}
            {report && (
                <div className="flex items-center gap-6 px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm">
                    <span className="text-gray-500">
                        Ngày: <strong className="text-blue-700">{dayjs(report.date).format("DD/MM/YYYY")}</strong>
                    </span>
                    <span className="text-gray-500">
                        Số bệnh nhân: <strong className="text-indigo-700">{report.totalPatients}</strong>
                        <span className="text-gray-400"> / {report.maxPatientsLimit}</span>
                    </span>
                    {report.totalPatients >= report.maxPatientsLimit && (
                        <Tag color="red">Đã đạt giới hạn</Tag>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-0">
                {isLoading && (
                    <div className="flex justify-center items-center py-16">
                        <Spin size="large" />
                    </div>
                )}
                {isError && (
                    <div className="p-6">
                        <Alert type="error" message={`Lỗi tải dữ liệu: ${(error as Error)?.message}`} showIcon />
                    </div>
                )}
                {!isLoading && !isError && (
                    <Table
                        columns={columns}
                        dataSource={report?.data.map((item) => ({ ...item, key: item.stt })) ?? []}
                        pagination={false}
                        bordered
                        size="middle"
                        locale={{ emptyText: "Không có bệnh nhân nào trong ngày này" }}
                        rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                    />
                )}
            </div>
        </div>
    );
};

export default BM1;

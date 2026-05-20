import { useState } from "react";
import { DatePicker, Table, Spin, Alert } from "antd";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import reportApi from "@/apis/report";
import type { BM3Item } from "@/types/reportType";

const columns = [
    { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
    { title: "Họ Tên", dataIndex: "fullName" },
    { title: "Ngày Khám", dataIndex: "date", width: 130, align: "center" as const },
    { title: "Loại Bệnh", dataIndex: "diseaseType" },
    { title: "Triệu Chứng", dataIndex: "symptoms" },
];

const BM3 = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const dateStr = selectedDate.format("YYYY-MM-DD");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["bm3", dateStr],
        queryFn: () => reportApi.getBM3(dateStr),
    });

    const tableData: BM3Item[] = data?.data ?? [];
    const totalPatients: number = data?.totalPatients ?? 0;

    return (
        <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">BM3</span>
                    <h2 className="text-white font-bold text-lg">{data?.title ?? "Danh Sách Bệnh Nhân"}</h2>
                </div>
                <DatePicker
                    value={selectedDate}
                    onChange={(d) => d && setSelectedDate(d)}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    className="border-gray-600"
                />
            </div>

            {/* Summary */}
            <div className="flex items-center gap-6 px-6 py-3 bg-purple-50 border-b border-purple-100">
                <span className="text-sm text-gray-600">
                    Ngày: <strong>{selectedDate.format("DD/MM/YYYY")}</strong>
                </span>
                <span className="text-sm text-gray-600">
                    Tổng bệnh nhân: <strong className="text-purple-600">{totalPatients}</strong>
                </span>
            </div>

            {/* Content */}
            {isError ? (
                <div className="p-6">
                    <Alert type="error" message="Không thể tải dữ liệu. Vui lòng thử lại." />
                </div>
            ) : (
                <Spin spinning={isLoading}>
                    <Table
                        columns={columns}
                        dataSource={tableData.map((item) => ({ ...item, key: item.stt }))}
                        pagination={false}
                        bordered
                        size="middle"
                        locale={{ emptyText: "Không có dữ liệu trong ngày này" }}
                        rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                    />
                </Spin>
            )}
        </div>
    );
};

export default BM3;

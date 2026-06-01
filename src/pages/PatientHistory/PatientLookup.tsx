import { useState } from "react";
import { DatePicker, Table, Spin, Alert, Button, Tooltip, Input, Modal, Descriptions, Tag, Divider } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import reportApi from "@/apis/report";
import examineApi from "@/apis/examine";
import type { BM3Item } from "@/types/reportType";

const { Search } = Input;

const PatientLookup = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const dateStr = selectedDate.format("YYYY-MM-DD");

    const [viewRecordId, setViewRecordId] = useState<string | null>(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["patientLookup", dateStr, searchKeyword],
        queryFn: () => reportApi.getBM3(searchKeyword ? undefined : dateStr, searchKeyword),
    });

    const { data: recordData, isLoading: isRecordLoading } = useQuery({
        queryKey: ["medicalRecord", viewRecordId],
        queryFn: async () => {
            if (!viewRecordId) return null;
            const res = await examineApi.getPrescriptionFull(viewRecordId);
            return res.examineLog;
        },
        enabled: !!viewRecordId,
    });

    const tableData: BM3Item[] = data?.data ?? [];
    const totalPatients: number = data?.totalPatients ?? 0;

    const columns = [
        { title: "STT", dataIndex: "stt", width: 60, align: "center" as const },
        { title: "Họ Tên", dataIndex: "fullName" },
        { title: "Ngày Khám", dataIndex: "date", width: 130, align: "center" as const },
        { title: "Loại Bệnh", dataIndex: "diseaseType" },
        { title: "Triệu Chứng", dataIndex: "symptoms" },
        {
            title: "Thao Tác",
            key: "action",
            width: 100,
            align: "center" as const,
            render: (_: any, record: BM3Item) => (
                <Tooltip title="Xem Bệnh Án">
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        onClick={() => setViewRecordId(record.examineLogId)} 
                        size="small"
                        className="bg-indigo-500 border-none hover:bg-indigo-600"
                    />
                </Tooltip>
            ),
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-6">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1867c0] to-[#0a4b9c] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-white font-bold text-lg">Tra Cứu Bệnh Nhân</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <Search
                            placeholder="Tìm theo Tên, SĐT..."
                            allowClear
                            onSearch={(val) => setSearchKeyword(val)}
                            className="w-full sm:w-[250px]"
                            style={{ borderRadius: 6 }}
                        />
                        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1 w-full sm:w-auto mt-2 sm:mt-0">
                            <span className="text-white text-sm font-medium whitespace-nowrap">Chọn ngày:</span>
                            <DatePicker
                                value={selectedDate}
                                onChange={(d) => {
                                    if (d) {
                                        setSelectedDate(d);
                                        setSearchKeyword(""); // clear search when picking date
                                    }
                                }}
                                format="DD/MM/YYYY"
                                allowClear={false}
                                className="border-none w-full sm:w-[130px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex items-center gap-6 px-6 py-3 bg-[#e8f2fc] border-b border-[#b3d4f5]">
                    <span className="text-sm text-gray-700">
                        {searchKeyword ? (
                            <>Kết quả tìm kiếm cho: <strong>{searchKeyword}</strong></>
                        ) : (
                            <>Ngày tra cứu: <strong>{selectedDate.format("DD/MM/YYYY")}</strong></>
                        )}
                    </span>
                    <span className="text-sm text-gray-700">
                        Số lượt khám: <strong className="text-[#1867c0]">{totalPatients}</strong>
                    </span>
                </div>

                {/* Content */}
                {isError ? (
                    <div className="p-6">
                        <Alert type="error" message="Không thể tải dữ liệu bệnh nhân. Vui lòng thử lại." />
                    </div>
                ) : (
                    <Spin spinning={isLoading}>
                        <Table
                            columns={columns}
                            dataSource={tableData.map((item) => ({ ...item, key: item.stt }))}
                            pagination={false}
                            bordered
                            size="middle"
                            locale={{ emptyText: searchKeyword ? "Không tìm thấy bệnh nhân" : "Không có bệnh nhân nào khám trong ngày này" }}
                            rowClassName={(_, i) => (i % 2 === 0 ? "bg-white" : "bg-gray-50")}
                        />
                    </Spin>
                )}
            </div>

            {/* Medical Record Modal */}
            <Modal
                title={<div className="text-xl font-bold text-[#1867c0]">Hồ Sơ Bệnh Án</div>}
                open={!!viewRecordId}
                onCancel={() => setViewRecordId(null)}
                footer={[
                    <Button key="close" onClick={() => setViewRecordId(null)}>Đóng</Button>
                ]}
                width={800}
                centered
            >
                {isRecordLoading ? (
                    <div className="flex justify-center py-10"><Spin size="large" /></div>
                ) : recordData ? (
                    <div className="mt-4">
                        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} size="small">
                            <Descriptions.Item label="Triệu chứng">{recordData.symptoms || "Không có"}</Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={recordData.status === 'done' ? 'green' : 'orange'}>
                                    {recordData.status === 'done' ? 'Đã khám' : 'Chưa khám'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Chẩn đoán" span={2}>
                                {recordData.details?.map((d: any) => (
                                    <Tag color="blue" key={d.diseaseID}>{d.disease?.diseaseName || d.diseaseID}</Tag>
                                )) || "Chưa có chẩn đoán"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hướng điều trị" span={2}>{recordData.treatmentPlan || "Không có"}</Descriptions.Item>
                            <Descriptions.Item label="Chỉ số cơ thể" span={2}>
                                Chiều cao: {recordData.height ? `${recordData.height} cm` : "--"} | 
                                Cân nặng: {recordData.weight ? `${recordData.weight} kg` : "--"} | 
                                Nhóm máu: {recordData.blood ? recordData.blood.toUpperCase() : "--"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú bác sĩ" span={2}>{recordData.note || "Không có"}</Descriptions.Item>
                        </Descriptions>

                        {recordData.prescription && (
                            <>
                                <Divider orientation="left" plain><span className="font-semibold text-lg text-gray-700">Đơn thuốc chỉ định</span></Divider>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="mb-3 text-sm"><strong>Số ngày điều trị:</strong> {recordData.prescription.totalTreatmentDays} ngày</p>
                                    <Table 
                                        dataSource={recordData.prescription.details || []}
                                        pagination={false}
                                        size="small"
                                        rowKey="medicineID"
                                        columns={[
                                            { title: 'Tên thuốc', dataIndex: ['medicine', 'medicineName'], key: 'name' },
                                            { title: 'Số lượng', dataIndex: 'quantity', key: 'qty', width: 100, align: 'center' },
                                            { title: 'Cách dùng', dataIndex: 'usage', key: 'usage' },
                                        ]}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <Alert type="warning" message="Không tìm thấy chi tiết bệnh án" />
                )}
            </Modal>
        </div>
    );
};

export default PatientLookup;

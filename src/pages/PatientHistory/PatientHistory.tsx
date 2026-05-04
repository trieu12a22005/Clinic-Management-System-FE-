import type { ExamineHistoryItem } from "@/types/examine";
import { Card, List, Tag } from "antd";
import { useState } from "react";



type PatientHistoryProps = {
  data: ExamineHistoryItem[];
};

const getStatusTag = (status: ExamineHistoryItem["status"]) => {
  switch (status) {
    case "done":
      return <Tag color="green">Đã khám</Tag>;
    case "pending":
      return <Tag color="orange">Chờ khám</Tag>;
    case "cancelled":
      return <Tag color="red">Đã hủy</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

export const PatientHistory = ({ data }: PatientHistoryProps) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  return (
    <List
      dataSource={data}
      locale={{ emptyText: "Không có lịch sử khám" }}
      renderItem={(item) => {
        const expanded = expandedKey === item.examineLogID;

        return (
          <List.Item style={{ display: "block", padding: 0, marginBottom: 12 }}>
            <Card
              hoverable
              onClick={() =>
                setExpandedKey(expanded ? null : item.examineLogID)
              }
              style={{ cursor: "pointer" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {item.examinedAt} - {item.doctorName}
                  </div>
                  <div style={{ color: "#666", marginTop: 4 }}>
                    {item.diagnose}
                  </div>
                </div>

                <div>{getStatusTag(item.status)}</div>
              </div>

              {expanded && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: "1px solid #f0f0f0",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div>
                    <b>Triệu chứng:</b> {item.symptoms}
                  </div>
                  <div>
                    <b>Chẩn đoán:</b> {item.diagnose}
                  </div>
                  <div>
                    <b>Hướng điều trị:</b> {item.treatmentPlan}
                  </div>
                  <div>
                    <b>Ghi chú:</b> {item.note || "Không có"}
                  </div>
                </div>
              )}
            </Card>
          </List.Item>
        );
      }}
    />
  );
};
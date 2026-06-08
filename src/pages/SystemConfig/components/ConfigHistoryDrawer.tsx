import { Drawer, Timeline, Tag, Typography, Spin, Empty, Alert, Badge } from "antd";
import { HistoryOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useConfigHistory } from "../useSystemconfig";
import type { SystemConfigHistoryItem } from "@/types/systemConfig";

const { Text } = Typography;

interface Props {
  configKey: string | null;
  onClose: () => void;
}

/** Format giá trị: nếu là số thì format tiền VN */
function formatValue(value: string) {
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== "") {
    return num.toLocaleString("vi-VN");
  }
  return value;
}

/** Format ngày theo locale VN */
function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** Format timestamp */
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const HistoryTimelineItem = ({ item }: { item: SystemConfigHistoryItem }) => {
  const isPending = item.isPending;

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isPending
          ? "border-amber-300 bg-amber-50"
          : "border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
      }`}
    >
      {/* Giá trị */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-indigo-700">
          {formatValue(item.value)}
        </span>
        {isPending ? (
          <Tag icon={<ClockCircleOutlined />} color="warning">
            Chờ áp dụng
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã áp dụng
          </Tag>
        )}
      </div>

      {/* Ngày áp dụng */}
      <div className="flex items-center gap-1.5 text-sm mb-1">
        <CalendarOutlined className={isPending ? "text-amber-500" : "text-green-500"} />
        <Text strong className={isPending ? "text-amber-700" : "text-green-700"}>
          {isPending ? "Áp dụng từ: " : "Ngày áp dụng: "}
        </Text>
        <Text className={isPending ? "text-amber-700" : "text-gray-700"}>
          {formatDate(item.effectiveDate)}
        </Text>
      </div>

      {/* Thời điểm admin cập nhật */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <ClockCircleOutlined />
        <span>Admin cập nhật lúc: {formatDateTime(item.changedAt)}</span>
      </div>
    </div>
  );
};

export const ConfigHistoryDrawer = ({ configKey, onClose }: Props) => {
  const { data, isLoading, isError } = useConfigHistory(configKey);

  const history: SystemConfigHistoryItem[] = data?.data ?? [];
  const pendingItem = history.find((h) => h.isPending);
  const appliedHistory = history.filter((h) => !h.isPending);

  const timelineItems = history.map((item) => ({
    dot: item.isPending ? (
      <Badge dot color="orange">
        <ClockCircleOutlined className="text-amber-500 text-base" />
      </Badge>
    ) : (
      <CheckCircleOutlined className="text-green-500 text-base" />
    ),
    children: <HistoryTimelineItem key={item.id} item={item} />,
  }));

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <HistoryOutlined className="text-indigo-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Lịch sử thay đổi</div>
            {configKey && (
              <Tag color="blue" className="font-mono text-xs mt-0.5">
                {configKey}
              </Tag>
            )}
          </div>
        </div>
      }
      open={!!configKey}
      onClose={onClose}
      width={480}
      styles={{ body: { padding: "16px 20px" } }}
    >
      {/* Banner pending nếu có */}
      {pendingItem && (
        <Alert
          type="warning"
          showIcon
          className="mb-4 rounded-xl"
          message={
            <span className="font-semibold text-amber-800">
              Giá mới sẽ có hiệu lực từ ngày mai
            </span>
          }
          description={
            <span className="text-amber-700">
              Giá trị <strong>{formatValue(pendingItem.value)}</strong> sẽ áp dụng từ{" "}
              <strong>{formatDate(pendingItem.effectiveDate)}</strong>.
              <br />
              Mọi hóa đơn hôm nay vẫn dùng giá hiện tại.
            </span>
          }
        />
      )}

      {/* Timeline */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" tip="Đang tải lịch sử..." />
        </div>
      ) : isError ? (
        <Alert type="error" message="Không thể tải lịch sử thay đổi" showIcon />
      ) : history.length === 0 ? (
        <Empty
          description={
            <span className="text-gray-400">
              Chưa có lịch sử thay đổi nào.
              <br />
              Cấu hình này chưa được cập nhật kể từ khi tạo.
            </span>
          }
          className="py-12"
        />
      ) : (
        <div>
          <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <HistoryOutlined />
            <span>
              {appliedHistory.length} lần đã áp dụng
              {pendingItem ? " · 1 lần đang chờ" : ""}
            </span>
          </div>
          <Timeline items={timelineItems} />
        </div>
      )}
    </Drawer>
  );
};

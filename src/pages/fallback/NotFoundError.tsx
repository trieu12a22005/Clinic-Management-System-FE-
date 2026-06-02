import { url } from "@/utils/url";
import { Button, Typography } from "antd";

const { Title, Text } = Typography;

function NotFoundError() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-50">
          <span className="text-8xl font-bold text-indigo-600">404</span>
        </div>
        <Title level={1} className="!mb-2">
          Lỗi
        </Title>
        <Text type="secondary">Trang web không tồn tại</Text>
        <div className="mt-6">
          <Button type="primary" size="large" href={url.dashboard}>
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundError;

// import { UseAuth } from "@/AuthContext";
import { useNotifications, useMarkNotificationRead } from "./useRoleHome";
import { Avatar, Calendar, Collapse, Spin, theme } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useCheckPermission } from "@/hooks/useCheckPermission";
import { useProfile } from "@/hooks/useProfile";
const RoleHome = () => {
  const { data: user } = useProfile();
  const { notifications, isLoading: notiLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const announcements = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    date: dayjs(n.createdAt).format("DD/MM/YYYY"),
    content: n.description ?? "",
    link: n.link ?? null,
    isNew: !n.isRead,
  }));

  const announcementItems = announcements.map((item) => ({
    key: item.id.toString(),
    label: (
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 mb-1">
          {item.isNew && <span className="flex h-2 w-2 rounded-full bg-red-500 flex-shrink-0"></span>}
          <span className={`font-semibold text-sm leading-tight ${item.isNew ? "text-gray-900" : "text-gray-700"}`}>
            {item.title}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500">{item.date}</span>
          {item.isNew && (
            <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
              Mới
            </span>
          )}
        </div>
      </div>
    ),
    children: (
      <div>
        <p className="text-xs text-gray-600 leading-relaxed m-0 px-2 border-l-2 border-[#1867c0] ml-1">
          {item.content}
        </p>
        {item.link && (
          <a href={item.link} className="text-xs text-[#1867c0] hover:underline mt-1 ml-3 inline-block">
            Xem chi tiết →
          </a>
        )}
      </div>
    ),
  }));

  // 3. Danh sách chức năng
  const allSystemFeatures = [
    {
      id: 1,
      title: "Quản lý Lịch làm việc - SCH.01",
      description: "Hỗ trợ lên lịch hẹn, theo dõi ca trực và sắp xếp phòng khám.",
      path: "/timetable",
      requiredPermissions: ["timetable.view"],
    },
    {
      id: 2,
      title: "Hồ sơ Bệnh án điện tử - EMR.02",
      description: "Tra cứu lịch sử khám bệnh, kết quả xét nghiệm và thông tin y tế.",
      path: "/patient-history",
      requiredPermissions: ["appointment.view", "ticket.view_all"],
    },
    {
      id: 4,
      title: "Quản lý hàng đợi phát thuốc - PHA.01",
      description: "Theo dõi hàng đợi, xem đơn thuốc và xác nhận phát thuốc cho bệnh nhân.",
      path: "/pharmacy-queue",
      requiredPermissions: ["medicine_ticket.view_all"],
    },
    {
      id: 5,
      title: "Quản lý Kho thuốc - PHA.02",
      description: "Tra cứu tồn kho, kiểm tra hạn sử dụng và cảnh báo thuốc sắp hết.",
      access: "Dược sĩ, Quản lý",
      path: "/pharmacy-inventory",
      // Đã chuyển sang dùng quyền UI chuyên biệt: "menu.pharmacy_inventory"
      requiredPermissions: ["menu.pharmacy_inventory"],
    },
    {
      id: 6,
      title: "Phiếu khám bệnh",
      description: "ghi kết quả khám bệnh, chẩn đoán và kế hoạch điều trị cho bệnh nhân",
      path: "/waiting-room",
      requiredPermissions: ["ticket.view_all", "ticket.view_next"],
    },
    {
      id: 7,
      title: "Quản lý thông báo",
      description: "Quản lý thông báo",
      path: "/notification",
      requiredPermissions: ["notification.manage"],
    },
    {
      id: 8,
      title: "Quản lý tài khoản",
      description: "Quản lý tài khoản",
      path: "/account",
      requiredPermissions: ["account.view", "account.create"],
    },
    {
      id: 9,
      title: "Quản lý lịch hẹn khám bệnh",
      description: "Xem lịch hẹn khám bệnh của bệnh nhân, xác nhận hoặc hủy lịch hẹn",
      path: "/appointment",
      requiredPermissions: ["appointment.view"],
    },
    {
      id: 10,
      title: "Quản lý Phân quyền",
      description: "Xem, tạo, chỉnh sửa và gán vai trò; quản lý quyền truy cập hệ thống.",
      path: "/role",
      requiredPermissions: ["role.manage"],
    },
    {
      id: 12,
      title: "Báo cáo thống kê",
      description: "Xem và xuất các báo cáo doanh thu, khám bệnh, thuốc",
      path: "/report",
      requiredPermissions: ["report.view"],
    },
    {
      id: 11,
      title: "Trang xếp lịch làm việc",
      description: "Xem và quản lý lịch làm việc của các nhân viên trong phòng khám",
      path: "/schedule",
      requiredPermissions: ["timetable.add_new", "timetable.update", "timetable.delete"],
    },

  ];

  // Lọc tính năng dựa trên permissions của user (nếu requiredPermissions rỗng thì ai cũng xem được)
  const { hasPermission } = useCheckPermission();
  const systemFeatures = allSystemFeatures.filter((feature) => {
    return hasPermission(feature.requiredPermissions);
  });

  // Token cho Calendar Ant Design
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: "100%",
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
    backgroundColor: "#ffffff",
  };
  const navigate = useNavigate();
  const handleClick = (path: string) => {
    navigate(path);
  };
  return (
    <div className="min-h-screen bg-white pb-12 font-sans text-gray-800">
      {/* THANH TÌM KIẾM */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex w-full max-w-lg shadow-sm">
          <input
            type="text"
            placeholder="Tìm kiếm chức năng hoặc bệnh nhân..."
            className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-[#1867c0] focus:outline-none"
          />
          <button className="flex items-center justify-center rounded-r-md bg-[#1867c0] px-5 text-white hover:bg-blue-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar
            size={64}
            src={
              user?.avatar ||
              "https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg"
            }
            className="border border-gray-200"
          />
          <div>
            <h1 className="text-xl text-gray-800 font-semibold">
              Chào mừng quay trở lại, {user?.roleDescription} {user?.firstName + " " + user?.lastName}! 👋
            </h1>
            <p className="text-[#1867c0] text-sm capitalize">{user?.roleName}</p>
          </div>
        </div>
      </div>

      {/* ================= BỐ CỤC 3 CỘT (Thông báo - Chức năng - Lịch) CÙNG MỘT HÀNG ================= */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* CỘT 1: Thông báo (Chiếm 3/12) */}
        <div className="xl:col-span-3">
          <h2 className="text-lg text-gray-700 font-bold mb-4 border-b pb-2 border-gray-200">Thông báo hệ thống</h2>
          <div className="rounded-md shadow-sm border border-gray-200 overflow-hidden bg-white">
            {notiLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Không có thông báo nào.</p>
            ) : (
              <Collapse
                items={announcementItems}
                ghost
                expandIconPosition="start"
                onChange={(keys) => {
                  // Khi mở một thông báo chưa đọc → đánh dấu đã đọc
                  const lastKey = Array.isArray(keys) ? keys[keys.length - 1] : keys;
                  if (!lastKey) return;
                  const target = announcements.find((a) => a.id === lastKey);
                  if (target?.isNew) markRead.mutate(lastKey as string);
                }}
              />
            )}
          </div>
        </div>

        {/* CỘT 2: Chức năng */}
        <div className="xl:col-span-6">
          <h2 className="text-lg text-gray-700 font-bold mb-4 border-b pb-2 border-gray-200">Các chức năng của tôi</h2>
          <div className="space-y-4">
            {systemFeatures.map((feature) => (
              <div
                key={feature.id}
                className="rounded-md border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => handleClick(feature.path)}
              >
                <h3 className="text-lg sm:text-[20px] font-bold text-[#0066cc] mb-2 cursor-pointer hover:underline leading-tight">
                  {feature.title}
                </h3>

                <div className="text-sm text-gray-800 space-y-1">
                  <p>
                    <strong className="font-semibold text-gray-900">Mô tả: </strong>
                    <span className="text-gray-600">{feature.description}</span>
                  </p>
                  {feature.access && (
                    <p>
                      <strong className="font-semibold text-gray-900">Quyền truy cập: </strong>
                      <span className="text-gray-600">{feature.access}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT 3: Widget Lịch */}
        <div className="xl:col-span-3">
          <div className="rounded-md border border-gray-200 bg-[#f8f9fa] p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2 border-transparent">Lịch</h2>

            <div style={wrapperStyle}>
              <Calendar fullscreen={false} />
            </div>

            <hr className="my-4 border-gray-300" />
            <div className="text-center text-sm text-[#1867c0]">
              <button className="hover:underline">Full calendar</button>
              <span className="mx-2">•</span>
              <button className="hover:underline">Quản lí theo dõi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleHome;

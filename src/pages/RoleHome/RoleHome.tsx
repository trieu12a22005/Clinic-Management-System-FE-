import { Avatar, Calendar, Collapse, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
const RoleHome = () => {
    // 1. Dữ liệu User
    const user = {
        name: 'Huỳnh Phạm Long Triều',
        role: 'doctor',
        avatar: 'https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg',
    };
    // 2. Danh sách thông báo
    const announcements = [
        {
            id: 1,
            title: 'Bảo trì hệ thống Lịch (SCH.01)',
            date: '08/03/2026',
            content: 'Hệ thống sẽ tạm ngưng để bảo trì từ 22:00 đến 23:30. Vui lòng sắp xếp công việc.',
            isNew: true,
        },
        {
            id: 2,
            title: 'Quy định kê đơn điện tử',
            date: '05/03/2026',
            content: 'Yêu cầu điền đầy đủ mã ICD-10 khi xuất đơn thuốc bắt đầu từ tuần sau.',
            isNew: false,
        },
        {
            id: 3,
            title: 'Nghỉ lễ Giỗ Tổ',
            date: '01/03/2026',
            content: 'Phòng khám nghỉ lễ vào 10/3 Âm lịch. Kiểm tra lại lịch trực cấp cứu.',
            isNew: false,
        }
    ];

    const announcementItems = announcements.map((item) => ({
        key: item.id.toString(),
        label: (
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-2 mb-1">
                    {item.isNew && <span className="flex h-2 w-2 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span className={`font-semibold text-sm leading-tight ${item.isNew ? 'text-gray-900' : 'text-gray-700'}`}>
                        {item.title}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">{item.date}</span>
                    {item.isNew && (
                        <span className="bg-red-100 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Mới</span>
                    )}
                </div>
            </div>
        ),
        children: (
            <p className="text-xs text-gray-600 leading-relaxed m-0 px-2 border-l-2 border-[#1867c0] ml-1">
                {item.content}
            </p>
        ),
    }));

    // 3. Danh sách chức năng
    const systemFeatures = [
        {
            id: 1,
            title: 'Quản lý Lịch làm việc - SCH.01',
            description: 'Hỗ trợ lên lịch hẹn, theo dõi ca trực và sắp xếp phòng khám.',
            path: '/timetable'
        },
        {
            id: 2,
            title: 'Hồ sơ Bệnh án điện tử - EMR.02',
            description: 'Tra cứu lịch sử khám bệnh, kết quả xét nghiệm và thông tin y tế.',
            path: '/medical-records'
        },
        {
            id: 4,
            title: 'Quản lý hàng đợi phát thuốc - PHA.01',
            description: 'Theo dõi hàng đợi, xem đơn thuốc và xác nhận phát thuốc cho bệnh nhân.',
            path: '/pharmacy-queue'
        },
        {
            id: 5,
            title: 'Quản lý Kho thuốc - PHA.02',
            description: 'Tra cứu tồn kho, kiểm tra hạn sử dụng và cảnh báo thuốc sắp hết.',
            access: 'Dược sĩ, Quản lý',
            path: '/pharmacy-inventory'
        },
        {
            id: 6,
            title: 'Phiếu khám bệnh',
            description: 'ghi kết quả khám bệnh, chẩn đoán và kế hoạch điều trị cho bệnh nhân',
            path: '/waiting-room'
        }
    ];

    // Token cho Calendar Ant Design
    const { token } = theme.useToken();
    const wrapperStyle = {
        width: '100%',
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        backgroundColor: '#ffffff',
    };
    const navigate = useNavigate()
    const handleClick = (path:string) =>{
        navigate(path);
        
    }
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 mt-4 mb-8">
                <div className="flex items-center gap-4">
                    <Avatar size={64} src={user.avatar} className="border border-gray-200" />
                    <div>
                        <h1 className="text-xl text-gray-800 font-semibold">
                            Chào mừng quay trở lại, Bác sĩ {user.name}! 👋
                        </h1>
                        <p className="text-[#1867c0] text-sm capitalize">{user.role}</p>
                    </div>
                </div>
            </div>

            {/* ================= BỐ CỤC 3 CỘT (Thông báo - Chức năng - Lịch) CÙNG MỘT HÀNG ================= */}
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* CỘT 1: Thông báo (Chiếm 3/12) */}
                <div className="xl:col-span-3">
                    <h2 className="text-lg text-gray-700 font-bold mb-4 border-b pb-2 border-gray-200">
                        Thông báo hệ thống
                    </h2>
                    <div className="rounded-md shadow-sm border border-gray-200 overflow-hidden bg-white">
                        <Collapse 
                            items={announcementItems} 
                            defaultActiveKey={['1']} 
                            ghost 
                            expandIconPosition="start"
                        />
                    </div>
                </div>

                {/* CỘT 2: Chức năng */}
                <div className="xl:col-span-6">
                    <h2 className="text-lg text-gray-700 font-bold mb-4 border-b pb-2 border-gray-200">
                        Các chức năng của tôi
                    </h2>
                    <div className="space-y-4">
                        {systemFeatures.map((feature) => (
                            <div 
                                key={feature.id} 
                                className="rounded-md border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                                onClick ={() => handleClick(feature.path)}
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
                        <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2 border-transparent">
                            Lịch
                        </h2>
                        
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

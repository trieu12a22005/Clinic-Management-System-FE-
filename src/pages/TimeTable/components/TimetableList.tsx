
import { useMemo, useState } from "react";
import { useTimetable, useAllTimetable } from "../useTimetable";
import FacultyService from "@/services/facultyService";
import FacultyFilter from "./FacultyFilter";
import { Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

export interface WeekDay {
    key: string;
    label: string;
    date: string;
}
const TimetableList = ({ accountID }: { accountID: string }) => {
    const { timetables, isError, error } = useTimetable(accountID);
    const { timetables: allTimetables } = useAllTimetable();
    const { faculties = [] } = FacultyService();
    const [activeTab, setActiveTab] = useState<string>('CÁ NHÂN');
    const [activeFacultyId, setActiveFacultyId] = useState<string | null>(null);

    const currentTimetables = activeTab === 'TOÀN BỆNH VIỆN' ? allTimetables : timetables;

    // Group timetables by roomID → mỗi phòng 1 row, không cần API riêng
    const roomRows = useMemo(() => {
        if (!currentTimetables) return [];
        const map = new Map<string, { roomID: string; roomName: string; facultyName?: string, facultyID?: string | number }>();
        currentTimetables.forEach((t) => {
            if (!map.has(t.roomID)) {
                map.set(t.roomID, {
                    roomID: t.roomID,
                    roomName: t.room.roomName,
                    facultyName: t.room.faculty?.facultyName,
                    facultyID: t.room.faculty?.facultyID,
                });
            }
        });

        let rows = Array.from(map.values());
        if (activeTab === 'TOÀN BỆNH VIỆN' && activeFacultyId) {
            rows = rows.filter(r => r.facultyID?.toString() === activeFacultyId.toString());
        }
        return rows;
    }, [currentTimetables, activeTab, activeFacultyId]);
    const tabs: string[] = ['CÁ NHÂN', 'TOÀN BỆNH VIỆN'];
    const weekDays: WeekDay[] = [
        { key: 'mon', label: 'Thứ 2', date: '02-03-2026' },
        { key: 'tue', label: 'Thứ 3', date: '03-03-2026' },
        { key: 'wed', label: 'Thứ 4', date: '04-03-2026' },
        { key: 'thu', label: 'Thứ 5', date: '05-03-2026' },
        { key: 'fri', label: 'Thứ 6', date: '06-03-2026' },
        { key: 'sat', label: 'Thứ 7', date: '07-03-2026' },
        { key: 'sun', label: 'Chủ nhật', date: '08-03-2026' },
    ];
    if (isError) return <div className="text-red-500">❌ Lỗi: {error?.message}</div>;
    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="mx-auto max-w-[1400px] bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-[#1867c0] mb-2 uppercase">Lịch làm việc</h1>
                    <div className="text-[#1867c0] text-sm font-medium flex justify-center items-center gap-2">
                        <button className="hover:underline">&lt;&lt; Tuần trước đó</button>
                        <span className="text-gray-400">|</span>
                        <button className="hover:underline font-bold text-gray-800">Tuần hiện tại</button>
                        <span className="text-gray-400">|</span>
                        <button className="hover:underline">Tuần kế tiếp &gt;&gt;</button>
                    </div>
                </div>
                {activeTab === 'TOÀN BỆNH VIỆN' ? (
                    <FacultyFilter
                        faculties={faculties}
                        activeFacultyId={activeFacultyId}
                        onSelectFaculty={setActiveFacultyId}
                    />

                ) : (
                    <div className="h-[40px] mb-8"></div>
                )}
                <div className="flex justify-center mb-8 flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2.5 cursor-pointer text-sm font-bold rounded transition-colors ${activeTab === tab
                                ? 'bg-[#E6E6FA] text-black border border-[#6495ED]'
                                : 'bg-[#6495ED] text-white hover:bg-blue-600'
                                }`}
                        >
                            LỊCH {tab}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1200px] border-collapse border border-gray-300 text-sm text-center">
                        <thead>
                            <tr className="bg-gray-50 text-gray-800">
                                <th className="border border-gray-300 p-2 w-[120px]">Phòng khám</th>
                                {weekDays.map((day) => (

                                    <th
                                        key={day.key}
                                        className="relative border border-gray-300 p-2 pr-8 w-[12%]"
                                    >
                                        {day.label}
                                        <br />
                                        <span className="font-normal text-xs">({day.date})</span>

                                        <div className="absolute right-1 top-1">
                                            <Dropdown
                                                menu={{
                                                    items: [
                                                        { key: "edit", label: "Sửa" },
                                                        { key: "delete", label: "Xóa" },
                                                        { key: "detail", label: "Chi tiết" },
                                                    ],
                                                    onClick: ({ key }) => {
                                                        console.log(key, day);
                                                    },
                                                }}
                                                trigger={["click"]}
                                                placement="bottomRight"
                                            >
                                                <Button
                                                    type="text"
                                                    icon={<MoreOutlined />}
                                                    onClick={(e) => e.preventDefault()}
                                                />
                                            </Dropdown>
                                        </div>
                                    </th>

                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roomRows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="border border-gray-300 text-center p-8 text-gray-400">
                                        Không có lịch làm việc trong tuần này
                                    </td>
                                </tr>
                            ) : (
                                roomRows.map((room) => (
                                    <tr key={room.roomID} className="h-[200px]">
                                        <td className="border border-gray-300 font-bold p-2 align-middle">
                                            <div className="text-lg">{room.roomName}</div>
                                            <div className="text-xs font-normal mt-2 text-gray-500">{room.facultyName}</div>
                                        </td>
                                        {weekDays.map((day) => {
                                            const entry = currentTimetables?.find(
                                                (t) => t.roomID === room.roomID && t.dayOfWeek === day.key
                                            );
                                            if (entry) {
                                                return (
                                                    <td key={day.key} className="border border-gray-300 p-3 align-top text-left transition-colors cursor-pointer">
                                                        <div className="font-bold text-left mt-[20px] text-[#6495ED]">
                                                            {entry.note}
                                                        </div>
                                                        <hr className="my-1 border-gray-300" />
                                                        <div className="text-xs">
                                                            <p className="font-bold text-left font-semibold mt-[10px]">
                                                                <span>BS: </span>{entry.account.firstName} {entry.account.lastName}
                                                            </p>
                                                        </div>
                                                    </td>
                                                );
                                            }
                                            return <td key={day.key} className="border border-gray-300 p-3"></td>;
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimetableList;
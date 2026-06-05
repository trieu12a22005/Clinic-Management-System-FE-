import { useMemo, useState } from "react";
import { useTimetable, useAllTimetable } from "../useTimetable";
import FacultyService from "@/services/facultyService";
import FacultyFilter from "./FacultyFilter";
import { Dropdown } from "antd";
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

    // Group timetables by roomID
    const roomRows = useMemo(() => {
        if (!currentTimetables) return [];
        const map = new Map<string, { roomID: string; roomName: string; facultyName?: string, facultyID?: string | number }>();
        currentTimetables.forEach((t) => {
            if (!map.has(t.roomID)) {
                map.set(t.roomID, {
                    roomID: t.roomID,
                    roomName: t.room.roomName ?? '',
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

    if (isError) return <div className="text-red-500 font-semibold text-center mt-10">❌ Lỗi: {error?.message}</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
            <div className="mx-auto max-w-[1440px] bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 tracking-tight uppercase">
                        Lịch Làm Việc
                    </h1>
                    <div className="flex items-center gap-4 bg-slate-100/80 px-6 py-2.5 rounded-full shadow-inner border border-slate-200/60 backdrop-blur-sm">
                        <button className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            <span className="hidden sm:inline">Tuần trước</span>
                        </button>
                        <div className="w-px h-5 bg-slate-300"></div>
                        <button className="text-indigo-700 font-bold hover:text-indigo-800 transition-colors text-sm sm:text-base">Tuần hiện tại</button>
                        <div className="w-px h-5 bg-slate-300"></div>
                        <button className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm flex items-center gap-1">
                            <span className="hidden sm:inline">Tuần tiếp</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-slate-100 p-1.5 rounded-full shadow-inner border border-slate-200/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 sm:px-10 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-out ${
                                    activeTab === tab
                                        ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                                        : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50'
                                }`}
                            >
                                LỊCH {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Faculty Filter */}
                <div className={`transition-all duration-500 overflow-hidden ${activeTab === 'TOÀN BỆNH VIỆN' ? 'max-h-32 mb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <FacultyFilter
                    faculties={faculties}
                        activeFacultyId={activeFacultyId}
                        onSelectFaculty={setActiveFacultyId}
                    />
                </div>

                {/* Table Area */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1200px] border-collapse text-sm text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-bold text-slate-700 uppercase tracking-wider w-[140px] text-center border-r border-slate-200">
                                        Phòng Khám
                                    </th>
                                    {weekDays.map((day) => (
                                        <th key={day.key} className="relative p-4 border-r border-slate-200 last:border-r-0 w-[12%] text-center group">
                                            <div className="font-extrabold text-slate-700 uppercase tracking-wide">{day.label}</div>
                                            <div className="text-xs font-medium text-slate-400 mt-1">{day.date}</div>
                                            
                                            {/* Minimal Dropdown trigger on hover */}
                                            <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            { key: "edit", label: "Sửa lịch" },
                                                            { key: "delete", label: <span className="text-red-500">Xóa lịch</span> },
                                                        ]
                                                    }}
                                                    trigger={["click"]}
                                                    placement="bottomRight"
                                                >
                                                    <button className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                                        <MoreOutlined className="text-lg" />
                                                    </button>
                                                </Dropdown>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {roomRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                                            <div className="flex flex-col items-center gap-3">
                                                <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Không có lịch làm việc nào được phân công.
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    roomRows.map((room) => (
                                        <tr key={room.roomID} className="group/row hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 border-r border-slate-200 align-middle text-center bg-slate-50/40 group-hover/row:bg-slate-100/50 transition-colors">
                                                <div className="text-lg font-extrabold text-slate-800">{room.roomName}</div>
                                                {room.facultyName && (
                                                    <div className="mt-2 inline-flex px-2.5 py-1 bg-slate-200/60 text-slate-600 text-[11px] font-bold uppercase rounded-full tracking-wide">
                                                        {room.facultyName}
                                                    </div>
                                                )}
                                            </td>
                                            {weekDays.map((day) => {
                                                const entry = currentTimetables?.find(
                                                    (t) => t.roomID === room.roomID && t.dayOfWeek === day.key
                                                );
                                                if (entry) {
                                                    return (
                                                        <td key={day.key} className="p-3 border-r border-slate-200 last:border-r-0 align-top bg-white">
                                                            <div className="h-full min-h-[140px] bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-indigo-100/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group/card">
                                                                <div className="flex-1">
                                                                    <div className="inline-flex items-center justify-center px-2.5 py-1 bg-indigo-100/80 text-indigo-700 text-[11px] font-extrabold uppercase tracking-wide rounded-md mb-3 border border-indigo-200/50">
                                                                        {entry.note || 'Ca Khám'}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-auto pt-3 border-t border-indigo-100/80 flex items-center gap-2">
                                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                                                                        {entry.account.firstName?.charAt(0).toUpperCase() || 'BS'}
                                                                    </div>
                                                                    <div className="flex flex-col overflow-hidden">
                                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Bác sĩ</span>
                                                                        <span className="text-sm font-semibold text-slate-800 truncate group-hover/card:text-indigo-700 transition-colors">
                                                                            {entry.account.firstName} {entry.account.lastName}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                                return <td key={day.key} className="p-3 border-r border-slate-200 last:border-r-0 bg-slate-50/30"></td>;
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetableList;
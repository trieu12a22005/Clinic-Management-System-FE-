import { useEffect, useMemo, useState } from 'react';
import timeTableApi from '../../../apis/timetable';
import type{ DayOfWeek, TimetableObject } from '../../../apis/timetable';

interface ScheduleTableProps {
    facultyID: string;
    facultyName: string;
    roomCount: number;
}

const DAYS_OF_WEEK: { key: DayOfWeek; label: string }[] = [
    { key: 'mon', label: 'Thứ hai' },
    { key: 'tue', label: 'Thứ ba' },
    { key: 'wed', label: 'Thứ tư' },
    { key: 'thu', label: 'Thứ năm' },
    { key: 'fri', label: 'Thứ sáu' },
    { key: 'sat', label: 'Thứ bảy' },
    { key: 'sun', label: 'Chủ nhật' },
];

const ScheduleTable = ({ facultyID, facultyName, roomCount }: ScheduleTableProps) => {
    const [timetables, setTimetables] = useState<Record<DayOfWeek, TimetableObject[]>>({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!facultyID) return;

        const fetchTimetables = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await timeTableApi.getAllTimetables(facultyID);
                setTimetables({
                    mon: response.timetables.mon ?? [],
                    tue: response.timetables.tue ?? [],
                    wed: response.timetables.wed ?? [],
                    thu: response.timetables.thu ?? [],
                    fri: response.timetables.fri ?? [],
                    sat: response.timetables.sat ?? [],
                    sun: response.timetables.sun ?? [],
                });
            } catch (err) {
                console.error('Failed to fetch timetables:', err);
                setError('Không thể tải dữ liệu thời khóa biểu.');
            } finally {
                setLoading(false);
            }
        };

        fetchTimetables();
    }, [facultyID]);

    const totalAssignedByDay = useMemo(() => {
        return DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day.key] = timetables[day.key]?.length ?? 0;
            return acc;
        }, {} as Record<DayOfWeek, number>);
    }, [timetables]);

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center text-gray-500">
                Đang tải thời khóa biểu cho <span className="font-semibold text-gray-700">{facultyName}</span>...
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{facultyName}</h2>
                    <p className="text-sm text-gray-500">
                        Phòng có sẵn: <span className="font-medium text-gray-700">{roomCount}</span>
                    </p>
                </div>
                {/* <div className="text-sm text-gray-500">
                    Mỗi ngày: <span className="font-medium text-gray-700">đã phân công {"<="} phòng</span>
                </div> */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse table-fixed min-w-[1100px]">
                    <thead>
                        <tr className="bg-gray-50">
                            {DAYS_OF_WEEK.map((day) => (
                                <th
                                    key={day.key}
                                    className="border-b border-r border-gray-200 px-3 py-4 text-center text-sm font-semibold text-gray-700 last:border-r-0"
                                >
                                    <div>{day.label}</div>
                                    <div className="mt-1 text-xs font-normal text-gray-500">
                                        {totalAssignedByDay[day.key] || 0} đã phân công
                                        {roomCount > 0 ? ` / ${roomCount} phòng` : ''}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {DAYS_OF_WEEK.map((day) => {
                                const daySchedules = timetables[day.key] ?? [];

                                return (
                                    <td
                                        key={day.key}
                                        className="align-top border-r border-gray-200 last:border-r-0 p-3 bg-white"
                                    >
                                        <div className="flex flex-col gap-3 min-h-[280px]">
                                            {daySchedules.length > 0 ? (
                                                daySchedules.map((schedule) => {
                                                    const accountName = `${schedule.account?.firstName ?? ''} ${schedule.account?.lastName ?? ''}`.trim();
                                                    const roomName = schedule.room?.roomName || schedule.room?.roomID || 'Phòng không xác định';

                                                    return (
                                                        <div
                                                            key={schedule.timeID}
                                                            className="rounded-lg border border-blue-100 bg-blue-50 p-3 shadow-sm"
                                                        >
                                                            <div className="text-sm font-semibold text-blue-900">
                                                                {accountName || 'Tài khoản không xác định'}
                                                            </div>
                                                            <div className="mt-2 text-xs text-blue-700">
                                                                <div>
                                                                    <span className="font-medium">Phòng:</span> {roomName}
                                                                </div>
                                                                <div className="mt-1 break-all">
                                                                    <span className="font-medium">ID Tài khoản:</span> {schedule.accountID}
                                                                </div>
                                                                {schedule.note ? (
                                                                    <div className="mt-2 rounded-md bg-white/70 p-2 text-gray-600">
                                                                        {schedule.note}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-10 text-sm text-gray-400">
                                                    Chưa phân công
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ScheduleTable;

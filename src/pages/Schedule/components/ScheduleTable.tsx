import { useEffect, useMemo, useState, useCallback } from 'react';
import timeTableApi from '../../../apis/timetable';
import type{ DayOfWeek, TimetableObject } from '../../../apis/timetable';
import DeleteTimetableModal from './DeleteTimetableModal';
import { toast } from 'react-hot-toast';

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTimetableId, setSelectedTimetableId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [draggedSchedule, setDraggedSchedule] = useState<TimetableObject | null>(null);
    const [dragOverDay, setDragOverDay] = useState<DayOfWeek | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [pendingTimetableId, setPendingTimetableId] = useState<string | null>(null);

    const fetchTimetables = useCallback(async ({ silent }: { silent?: boolean } = {}) => {
        if (!facultyID) return;
        if (!silent) {
            setLoading(true);
            setError('');
        }
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
            if (!silent) {
                setError('Không thể tải dữ liệu thời khóa biểu.');
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [facultyID]);

    useEffect(() => {
        fetchTimetables();
    }, [fetchTimetables]);

    const handleDeleteClick = (id: string) => {
        setSelectedTimetableId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, schedule: TimetableObject) => {
        e.stopPropagation();
        setDraggedSchedule(schedule);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', schedule.timeID);
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableDataCellElement>, day: DayOfWeek) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedSchedule && draggedSchedule.dayOfWeek !== day) {
            setDragOverDay(day);
        } else {
            setDragOverDay(null);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLTableDataCellElement>) => {
        e.preventDefault();
        setDragOverDay(null);
    };

    const handleDrop = async (e: React.DragEvent<HTMLTableDataCellElement>, targetDay: DayOfWeek) => {
        e.preventDefault();
        e.stopPropagation();

        if (!draggedSchedule || draggedSchedule.dayOfWeek === targetDay) {
            setDraggedSchedule(null);
            setDragOverDay(null);
            return;
        }

        const originalScheduleId = draggedSchedule.timeID;
        const originalDay = draggedSchedule.dayOfWeek;
        const updatedSchedule = { ...draggedSchedule, dayOfWeek: targetDay };

        setIsUpdating(true);
        setPendingTimetableId(originalScheduleId);
        setTimetables((prev) => {
            const next = { ...prev };
            next[originalDay] = prev[originalDay].filter((item) => item.timeID !== originalScheduleId);
            next[targetDay] = [...prev[targetDay], updatedSchedule];
            return next;
        });

        try {
            await timeTableApi.updateTimetable(originalScheduleId, {
                dayOfWeek: targetDay,
            });
            toast.success('Cập nhật phân công thành công');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } catch (err) {
            console.error('Failed to update timetable:', err);
            toast.error('Cập nhật phân công thất bại');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } finally {
            setIsUpdating(false);
            setDraggedSchedule(null);
            setDragOverDay(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedTimetableId) return;
        setIsDeleting(true);
        try {
            await timeTableApi.deleteTimetable(selectedTimetableId);
            toast.success('Xóa phân công thành công');
            fetchTimetables();
        } catch (err) {
            console.error('Failed to delete timetable:', err);
            toast.error('Xóa phân công thất bại');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setSelectedTimetableId(null);
        }
    };

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
                                        className="align-top border-r border-gray-200 last:border-r-0 p-3 bg-white transition-colors"
                                        onDragOver={(e) => handleDragOver(e, day.key)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, day.key)}
                                    >
                                        <div
                                            className={`flex flex-col gap-3 min-h-[280px] rounded-lg p-2 transition-all ${
                                                dragOverDay === day.key
                                                    ? 'bg-green-50 border-2 border-dashed border-green-400'
                                                    : draggedSchedule
                                                    ? 'border-2 border-dashed border-transparent'
                                                    : ''
                                            }`}
                                        >
                                            {daySchedules.length > 0 ? (
                                                daySchedules.map((schedule) => {
                                                    const accountName = `${schedule.account?.firstName ?? ''} ${schedule.account?.lastName ?? ''}`.trim();
                                                    const roomName = schedule.room?.roomName || schedule.room?.roomID || 'Phòng không xác định';

                                                    const isDragged = draggedSchedule?.timeID === schedule.timeID;
                                                    const isPending = pendingTimetableId === schedule.timeID;
                                                    return (
                                                        <div
                                                            key={schedule.timeID}
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, schedule)}
                                                            className={`group relative rounded-lg border border-blue-100 bg-blue-50 p-3 shadow-sm transition-all cursor-move hover:border-blue-200 hover:shadow-md ${
                                                                isDragged ? 'opacity-50 bg-blue-100' : ''
                                                            } ${isPending ? 'opacity-70' : ''}`}
                                                        >
                                                            {!isPending && (
                                                                <button
                                                                    onClick={() => handleDeleteClick(schedule.timeID)}
                                                                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                                                                    title="Xóa phân công"
                                                                >
                                                                    <svg
                                                                        viewBox="0 0 24 24"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2.5}
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            <div className="text-sm font-semibold text-blue-900 pr-2">
                                                                {accountName || 'Tài khoản không xác định'}
                                                            </div>
                                                            <div className="mt-2 text-xs text-blue-700">
                                                                <div>
                                                                    <span className="font-medium">Phòng:</span> {roomName}
                                                                </div>
                                                                {/* <div className="mt-1 break-all">
                                                                    <span className="font-medium">ID Tài khoản:</span> {schedule.accountID}
                                                                </div> */}
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

            <DeleteTimetableModal
                open={isDeleteModalOpen}
                isPending={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default ScheduleTable;

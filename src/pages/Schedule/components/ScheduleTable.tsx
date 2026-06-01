import { useEffect, useMemo, useState, useCallback } from 'react';
import timeTableApi from '../../../apis/timetable';
import type{ DayOfWeek, TimetableObject } from '../../../apis/timetable';
import DeleteTimetableModal from './DeleteTimetableModal';
import AddTimetableModal from './AddTimetableModal';
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
    const [isAdding, setIsAdding] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [targetDayForAdd, setTargetDayForAdd] = useState<DayOfWeek | null>(null);
    const [addModalPosition, setAddModalPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const [draggedSchedule, setDraggedSchedule] = useState<TimetableObject | null>(null);
    const [dragOverDay, setDragOverDay] = useState<DayOfWeek | null>(null);
    const [pendingTimetableId, setPendingTimetableId] = useState<string | null>(null);
    const [deletingTimetableId, setDeletingTimetableId] = useState<string | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
    const [updatingNoteId, setUpdatingNoteId] = useState<string | null>(null);

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

    const handleAddClick = (day: DayOfWeek, event: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        const modalWidth = 320;
        const spacing = 8;
        let left = buttonRect.right + spacing;

        if (left + modalWidth > window.innerWidth - spacing) {
            left = Math.max(spacing, buttonRect.left - modalWidth - spacing);
        }

        left = Math.min(left, window.innerWidth - modalWidth - spacing);

        setAddModalPosition({
            top: Math.max(spacing, buttonRect.top),
            left,
            width: modalWidth,
        });
        setTargetDayForAdd(day);
        setIsAddModalOpen(true);
    };

    const handleConfirmAdd = async (account: TimetableObject['account']) => {
        if (!targetDayForAdd || !facultyID) return;

        setIsAdding(true);
        const tempID = `temp-${Date.now()}`;

        try {
            // Create optimistic timetable entry (we don't know which room yet)
            const optimisticTimetable: Partial<TimetableObject> = {
                timeID: tempID,
                accountID: account.accountID,
                dayOfWeek: targetDayForAdd,
                note: null,
                createdAt: new Date().toISOString(),
                account,
            };

            setPendingTimetableId(tempID);
            // Add optimistic entry without room info (will be filled on success)
            setTimetables((prev) => ({
                ...prev,
                [targetDayForAdd]: [...prev[targetDayForAdd], optimisticTimetable as TimetableObject],
            }));
            setIsAddModalOpen(false);
            setTargetDayForAdd(null);
            setAddModalPosition(null);

            // Let the backend handle room selection
            await timeTableApi.createTimetable({
                accountID: account.accountID,
                facultyID: facultyID,
                dayOfWeek: targetDayForAdd,
            });

            toast.success('Thêm phân công thành công');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } catch (err) {
            console.error('Failed to add timetable:', err);
            toast.error('Thêm phân công thất bại');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } finally {
            setIsAdding(false);
        }
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
        const hasAvailableRoom = (timetables[day] ?? []).length < roomCount;
        // Check if the dragged account is already working in a room on this day
        const daySchedules = timetables[day] ?? [];
        const accountAlreadyAssignedOnDay = draggedSchedule && daySchedules.some(
            (s) => s.accountID === draggedSchedule.accountID
        );
        if (draggedSchedule && draggedSchedule.dayOfWeek !== day && hasAvailableRoom && !accountAlreadyAssignedOnDay) {
            setDragOverDay(day);
        } else {
            setDragOverDay(null);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLTableDataCellElement>) => {
        e.preventDefault();
        // Only clear dragOverDay if leaving the entire cell
        if (e.currentTarget === e.target) {
            setDragOverDay(null);
        }
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
        const targetDaySchedules = timetables[targetDay] ?? [];

        // Check if there are available rooms
        if (targetDaySchedules.length >= roomCount) {
            toast.error('Không còn phòng trống cho ngày này');
            setDraggedSchedule(null);
            setDragOverDay(null);
            return;
        }

        // Check if account is already assigned on the target day
        if (targetDaySchedules.some((s) => s.accountID === draggedSchedule.accountID)) {
            toast.error('Nhân viên này đã được phân công vào ngày này');
            setDraggedSchedule(null);
            setDragOverDay(null);
            return;
        }

        const updatedSchedule = { ...draggedSchedule, dayOfWeek: targetDay };

        setPendingTimetableId(originalScheduleId);
        setTimetables((prev) => {
            const next = { ...prev };
            next[originalDay] = prev[originalDay].filter((item) => item.timeID !== originalScheduleId);
            next[targetDay] = [...prev[targetDay], updatedSchedule];
            return next;
        });

        try {
            await timeTableApi.updateTimetable(
                originalScheduleId,
                {
                    dayOfWeek: targetDay,
                },
                facultyID
            );
            toast.success('Cập nhật phân công thành công');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } catch (err) {
            console.error('Failed to update timetable:', err);
            toast.error('Cập nhật phân công thất bại');
            await fetchTimetables({ silent: true });
            setPendingTimetableId(null);
        } finally {
            setDraggedSchedule(null);
            setDragOverDay(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedTimetableId) return;
        setIsDeleting(true);
        setDeletingTimetableId(selectedTimetableId);
        try {
            await timeTableApi.deleteTimetable(selectedTimetableId);
            toast.success('Xóa phân công thành công');
            // Wait for new data to be fetched before updating the UI
            await fetchTimetables({ silent: true });
        } catch (err) {
            console.error('Failed to delete timetable:', err);
            toast.error('Xóa phân công thất bại');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setSelectedTimetableId(null);
            setDeletingTimetableId(null);
        }
    };

    const handleStartEditNote = (schedule: TimetableObject) => {
        setEditingNoteId(schedule.timeID);
        setNoteDrafts((prev) => ({
            ...prev,
            [schedule.timeID]: schedule.note ?? '',
        }));
    };

    const handleCancelEditNote = (scheduleId: string) => {
        setEditingNoteId(null);
        setNoteDrafts((prev) => {
            const next = { ...prev };
            delete next[scheduleId];
            return next;
        });
    };

    const handleSaveNote = async (schedule: TimetableObject) => {
        const draft = (noteDrafts[schedule.timeID] ?? '').trim();
        setUpdatingNoteId(schedule.timeID);
        try {
            await timeTableApi.updateTimetable(
                schedule.timeID,
                { note: draft.length > 0 ? draft : "" },
                facultyID
            );
            toast.success('Cập nhật ghi chú thành công');
            await fetchTimetables({ silent: true });
            handleCancelEditNote(schedule.timeID);
        } catch (err) {
            console.error('Failed to update note:', err);
            toast.error('Cập nhật ghi chú thất bại');
        } finally {
            setUpdatingNoteId(null);
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
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col min-h-0">
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

                <div className="overflow-x-auto flex-1 min-h-0">
                    <table className="w-full border-collapse table-fixed min-w-[1100px] h-full">
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
                                                className={`flex flex-col gap-3 min-h-[280px] rounded-lg p-2 border-2 border-dashed border-transparent transition-colors ${
                                                    dragOverDay === day.key
                                                        ? 'bg-green-50 border-green-400'
                                                        : draggedSchedule
                                                        ? 'bg-transparent'
                                                        : ''
                                                }`}
                                            >
                                                {daySchedules.length > 0 ? (
                                                    daySchedules.map((schedule) => {
                                                        const accountName = `${schedule.account?.firstName ?? ''} ${schedule.account?.lastName ?? ''}`.trim();
                                                        const roomName = schedule.room?.roomName || schedule.room?.roomID || 'Phòng không xác định';
                                                        const isEditing = editingNoteId === schedule.timeID;
                                                        const noteDraft = noteDrafts[schedule.timeID] ?? schedule.note ?? '';

                                                        const isDragged = draggedSchedule?.timeID === schedule.timeID;
                                                        const isPending = pendingTimetableId === schedule.timeID
                                                            || deletingTimetableId === schedule.timeID
                                                            || updatingNoteId === schedule.timeID;
                                                        return (
                                                            <div
                                                                key={schedule.timeID}
                                                                draggable={!isPending && !isEditing}
                                                                onDragStart={(e) => handleDragStart(e, schedule)}
                                                                className={`group relative rounded-lg border border-blue-100 bg-blue-50 p-3 shadow-sm transition-all cursor-move hover:border-blue-200 hover:shadow-md ${
                                                                    isDragged ? 'opacity-50 bg-blue-100' : ''
                                                                } ${isPending ? 'opacity-60 pointer-events-none' : ''}`}
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
                                                                    {(schedule.note || isEditing) && (
                                                                        <div className="mt-2 rounded-md bg-white/70 p-2 text-gray-600">
                                                                            <div className="relative">
                                                                                {isEditing ? (
                                                                                    <textarea
                                                                                        value={noteDraft}
                                                                                        onChange={(event) =>
                                                                                            setNoteDrafts((prev) => ({
                                                                                                ...prev,
                                                                                                [schedule.timeID]: event.target.value,
                                                                                            }))
                                                                                        }
                                                                                        rows={3}
                                                                                        className="w-full resize-none rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="pr-6 break-words">
                                                                                        {schedule.note}
                                                                                    </div>
                                                                                )}
                                                                                {!isEditing && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleStartEditNote(schedule)}
                                                                                        className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors hover:text-blue-600"
                                                                                        title="Chỉnh sửa ghi chú"
                                                                                    >
                                                                                        <svg
                                                                                            viewBox="0 0 24 24"
                                                                                            className="h-3 w-3"
                                                                                            fill="none"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth={2}
                                                                                        >
                                                                                            <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                d="M15.232 5.232l3.536 3.536m-2.036-1.5L7.5 16.5l-4 1 1-4 9.232-9.232a2.5 2.5 0 013.536 3.536z"
                                                                                            />
                                                                                        </svg>
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                            {isEditing && (
                                                                                <div className="mt-2 flex items-center gap-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleSaveNote(schedule)}
                                                                                        disabled={updatingNoteId === schedule.timeID}
                                                                                        className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                                                                    >
                                                                                        Lưu
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleCancelEditNote(schedule.timeID)}
                                                                                        disabled={updatingNoteId === schedule.timeID}
                                                                                        className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed"
                                                                                    >
                                                                                        Hủy
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!schedule.note && !isEditing && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStartEditNote(schedule)}
                                                                        className="absolute bottom-2 right-2 rounded-md border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase text-blue-600 opacity-0 transition-opacity group-hover:opacity-100"
                                                                        title="Ghi chú"
                                                                    >
                                                                        Note
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-10 text-sm text-gray-400">
                                                        Chưa phân công
                                                    </div>
                                                )}

                                                {/* Add Button */}
                                                {totalAssignedByDay[day.key] < roomCount && (
                                                    <button
                                                        onClick={(e) => handleAddClick(day.key, e)}
                                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                                        id={`add-btn-${day.key}`}
                                                    >
                                                        <svg 
                                                            className="h-4 w-4" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span>Thêm phân công</span>
                                                    </button>
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

            {/* Modal positioned outside the table */}
            {isAddModalOpen && targetDayForAdd && addModalPosition && (
                <div
                    style={{
                        position: 'fixed',
                        top: `${addModalPosition.top}px`,
                        left: `${addModalPosition.left}px`,
                        width: `${addModalPosition.width}px`,
                        zIndex: 50,
                    }}
                >
                    <AddTimetableModal
                        open={isAddModalOpen}
                        facultyID={facultyID}
                        dayOfWeek={targetDayForAdd}
                        isPending={isAdding}
                        existingAccountIDs={new Set(timetables[targetDayForAdd]?.map(s => s.accountID) || [])}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setTargetDayForAdd(null);
                            setAddModalPosition(null);
                        }}
                        onConfirm={handleConfirmAdd}
                    />
                </div>
            )}
        </>
    );
};

export default ScheduleTable;

import { useEffect, useState, useMemo } from 'react';
import timeTableApi from '../../../apis/timetable';
import type { DayOfWeek, TimetableAccount } from '../../../apis/timetable';

interface AddTimetableModalProps {
    open: boolean;
    facultyID: string;
    dayOfWeek: DayOfWeek;
    isPending: boolean;
    existingAccountIDs: Set<string>;
    onClose: () => void;
    onConfirm: (account: TimetableAccount) => void;
}

const AddTimetableModal = ({
    open,
    facultyID,
    isPending,
    existingAccountIDs,
    onClose,
    onConfirm,
}: AddTimetableModalProps) => {
    const [availableUsers, setAvailableUsers] = useState<TimetableAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!open || !facultyID) return;

        const fetchAvailableUsers = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await timeTableApi.getAvailableUsers(facultyID);
                setAvailableUsers(response.users);
            } catch (err) {
                console.error('Failed to fetch available users:', err);
                setError('Không thể tải danh sách nhân viên.');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableUsers();
    }, [open, facultyID]);

    const filteredUsers = useMemo(() => {
        const usersToFilter = availableUsers.filter((user) => !existingAccountIDs.has(user.accountID));
        if (!searchTerm.trim()) return usersToFilter;

        const normalizedSearch = searchTerm.toLowerCase();
        return usersToFilter.filter((user) => {
            const displayId = user.DisplayID?.toLowerCase() || '';
            const firstName = user.firstName?.toLowerCase() || '';
            const lastName = user.lastName?.toLowerCase() || '';

            return (
                displayId.includes(normalizedSearch) ||
                firstName.includes(normalizedSearch) ||
                lastName.includes(normalizedSearch)
            );
        });
    }, [availableUsers, searchTerm, existingAccountIDs]);

    if (!open) {
        return null;
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Chọn nhân viên</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Search Bar */}
            <div className="border-b border-gray-100 bg-gray-50 px-3 py-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
            </div>

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="py-4 text-center text-xs text-rose-600">{error}</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-500">
                        Không có nhân viên nào khả dụng
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {filteredUsers.map((user) => (
                            <button
                                key={user.accountID}
                                onClick={() => onConfirm(user)}
                                disabled={isPending}
                                className="w-full rounded-lg px-3 py-2 text-left transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                </div>
                                {user.DisplayID && (
                                    <div className="mt-0.5 text-[10px] font-mono font-semibold text-blue-600">
                                        {user.DisplayID}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddTimetableModal;

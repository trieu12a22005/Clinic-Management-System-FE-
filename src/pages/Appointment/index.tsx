import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import appointmentApi, {
  type AppointmentItem,
  type AppointmentStatus,
  type CreateAppointmentPayload,
} from '@/apis/appointment';
import facultyApi from '@/apis/faculty';
import AppointmentTable from './components/AppointmentTable';
import CreateAppointmentModal from './components/CreateAppointmentModal';

type StatusFilter = 'all' | AppointmentStatus;

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getPatientName = (appointment: AppointmentItem) => {
  const firstName = appointment.patient?.account?.firstName?.trim() ?? '';
  const lastName = appointment.patient?.account?.lastName?.trim() ?? '';
  return [firstName, lastName].filter(Boolean).join(' ').trim();
};

const AppointmentPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateString());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    data: appointmentsResponse,
    isLoading: isAppointmentsLoading,
    isError: isAppointmentsError,
  } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: () => appointmentApi.getAppointments({ scheduleDate: selectedDate }),
    meta: {
      suppressGlobalLoading: true,
    },
  });

  const {
    data: facultiesResponse,
    isLoading: isFacultiesLoading,
  } = useQuery({
    queryKey: ['faculties'],
    queryFn: () => facultyApi.getFaculties(),
  });

  const appointments = useMemo(
    () => appointmentsResponse?.appointments ?? [],
    [appointmentsResponse]
  );

  const faculties = useMemo(
    () => facultiesResponse?.faculties ?? [],
    [facultiesResponse]
  );

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus =
        statusFilter === 'all' || appointment.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        appointment.appointmentDisplayID,
        getPatientName(appointment),
        appointment.room?.roomName,
        appointment.room?.faculty?.facultyName,
        appointment.status,
        appointment.depositStatus,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [appointments, search, statusFilter]);

  const createAppointmentMutation = useMutation({
    mutationFn: (payload: CreateAppointmentPayload) =>
      appointmentApi.createAppointment(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsCreateModalOpen(false);
      toast.success(response.message ?? 'Tạo lịch hẹn thành công');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Tạo lịch hẹn thất bại'
      );
    },
  });

  const handleSelectedDateChange = (value: string) => {
    setSelectedDate(value || getTodayDateString());
  };

  const handleResetToToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const shouldShowResetToToday = selectedDate !== getTodayDateString();

  return (
    <div className="min-h-screen bg-[#f6f8fb] py-8 font-sans text-gray-800">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Danh sách lịch hẹn</h1>
            <p className="text-sm text-gray-500">
              Quản lý thông tin đặt lịch, tạo mới và xóa lịch hẹn nhanh.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isFacultiesLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            Tạo lịch hẹn
          </button>
        </div>

        {isAppointmentsError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Không thể tải danh sách lịch hẹn. Vui lòng thử lại.
          </div>
        ) : (
          <AppointmentTable
            items={filteredAppointments}
            displayedCount={filteredAppointments.length}
            isLoading={isAppointmentsLoading}
            search={search}
            onSearchChange={setSearch}
            selectedDate={selectedDate}
            shouldShowResetToToday={shouldShowResetToToday}
            onSelectedDateChange={handleSelectedDateChange}
            onResetToToday={handleResetToToday}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}
      </div>

      <CreateAppointmentModal
        open={isCreateModalOpen}
        faculties={faculties}
        isPending={createAppointmentMutation.isPending}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(payload) => createAppointmentMutation.mutate(payload)}
      />

    </div>
  );
};

export default AppointmentPage;

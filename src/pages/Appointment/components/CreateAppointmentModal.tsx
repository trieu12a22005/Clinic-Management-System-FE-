import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import roomApi from '@/apis/room';
import type {
  AppointmentType,
  CreateAppointmentPayload,
} from '@/apis/appointment';
import type { Faculty } from '@/types/facultyType';

type AppointmentFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthDate: string;
  address: string;
  appointmentType: AppointmentType;
  facultyID: string;
  roomID: string;
};

type AppointmentFormErrors = Partial<Record<keyof AppointmentFormValues, string>>;

interface CreateAppointmentModalProps {
  open: boolean;
  faculties: Faculty[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAppointmentPayload) => void;
}

const initialValues: AppointmentFormValues = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  birthDate: '',
  address: '',
  appointmentType: 'examine',
  facultyID: '',
  roomID: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateAppointmentModal = ({
  open,
  faculties,
  isPending,
  onClose,
  onSubmit,
}: CreateAppointmentModalProps) => {
  const [values, setValues] = useState<AppointmentFormValues>(initialValues);
  const [errors, setErrors] = useState<AppointmentFormErrors>({});

  const {
    data: rooms = [],
    isLoading: isRoomsLoading,
  } = useQuery({
    queryKey: ['rooms', values.facultyID],
    queryFn: () => roomApi.getRoomsByFaculty(values.facultyID),
    enabled: open && Boolean(values.facultyID),
    meta: {
      suppressGlobalLoading: true,
    },
  });

  useEffect(() => {
    if (!open) {
      setValues(initialValues);
      setErrors({});
    }
  }, [open]);

  const facultyPlaceholder = useMemo(() => {
    if (!values.facultyID) {
      return 'Chọn khoa trước';
    }

    if (rooms.length === 0) {
      return 'Không có phòng phù hợp';
    }

    return 'Chọn phòng';
  }, [rooms.length, values.facultyID]);

  if (!open) {
    return null;
  }

  const setFieldValue = <K extends keyof AppointmentFormValues>(
    field: K,
    value: AppointmentFormValues[K]
  ) => {
    setValues((prev) => {
      if (field === 'facultyID') {
        return {
          ...prev,
          facultyID: value as string,
          roomID: '',
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      ...(field === 'facultyID' ? { roomID: undefined } : {}),
    }));
  };

  const validate = () => {
    const nextErrors: AppointmentFormErrors = {};

    if (!values.firstName.trim()) {
      nextErrors.firstName = 'Vui lòng nhập tên.';
    }

    if (!values.lastName.trim()) {
      nextErrors.lastName = 'Vui lòng nhập họ.';
    }

    if (!values.phoneNumber.trim()) {
      nextErrors.phoneNumber = 'Vui lòng nhập số điện thoại.';
    }

    if (values.email.trim() && !emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (!values.facultyID) {
      nextErrors.facultyID = 'Vui lòng chọn khoa.';
    }

    if (!values.roomID) {
      nextErrors.roomID = 'Vui lòng chọn phòng.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phoneNumber: values.phoneNumber.trim(),
      email: values.email.trim() || undefined,
      birthDate: values.birthDate.trim() || undefined,
      address: values.address.trim() || undefined,
      appointmentType: values.appointmentType,
      facultyID: values.facultyID,
      roomID: values.roomID,
      scheduleDate: new Date().toISOString(),
    });
  };

  const renderError = (field: keyof AppointmentFormErrors) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-rose-600">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tạo lịch hẹn mới</h3>
            <p className="text-sm text-gray-500">
              Điền thông tin bệnh nhân và chọn khoa, phòng phù hợp.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Họ</label>
            <input
              value={values.lastName}
              onChange={(event) => setFieldValue('lastName', event.target.value)}
              placeholder="Nguyễn"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            {renderError('lastName')}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tên</label>
            <input
              value={values.firstName}
              onChange={(event) => setFieldValue('firstName', event.target.value)}
              placeholder="An"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            {renderError('firstName')}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              value={values.phoneNumber}
              onChange={(event) => setFieldValue('phoneNumber', event.target.value)}
              placeholder="0901234567"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            {renderError('phoneNumber')}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={values.email}
              onChange={(event) => setFieldValue('email', event.target.value)}
              placeholder="patient@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            {renderError('email')}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              type="date"
              value={values.birthDate}
              onChange={(event) => setFieldValue('birthDate', event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              value={values.address}
              onChange={(event) => setFieldValue('address', event.target.value)}
              placeholder="123 Nguyễn Văn Linh, Quận 7, TP.HCM"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Loại hẹn</label>
            <select
              value={values.appointmentType}
              onChange={(event) =>
                setFieldValue('appointmentType', event.target.value as AppointmentType)
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="examine">Khám bệnh</option>
              <option value="re_examine">Tái khám</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Khoa</label>
            <select
              value={values.facultyID}
              onChange={(event) => setFieldValue('facultyID', event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Chọn khoa</option>
              {faculties.map((faculty) => (
                <option key={faculty.facultyID} value={faculty.facultyID}>
                  {faculty.facultyName}
                </option>
              ))}
            </select>
            {renderError('facultyID')}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">Phòng</label>
            {isRoomsLoading ? (
              <div
                aria-hidden="true"
                className="h-[42px] w-full animate-pulse rounded-lg border border-gray-200 bg-gray-100"
              />
            ) : (
              <select
                value={values.roomID}
                onChange={(event) => setFieldValue('roomID', event.target.value)}
                disabled={!values.facultyID || rooms.length === 0}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">{facultyPlaceholder}</option>
                {rooms.map((room) => (
                  <option key={room.roomID} value={room.roomID}>
                    {room.roomName}
                  </option>
                ))}
              </select>
            )}
            {renderError('roomID')}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isPending ? 'Đang tạo...' : 'Tạo lịch hẹn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;

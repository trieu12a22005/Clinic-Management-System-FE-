import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import facultyApi from '@/apis/faculty';
import roomApi from '@/apis/room';
import type { CreateFacultyRequest, UpdateFacultyRequest } from '@/apis/faculty';
import type { CreateRoomRequest, UpdateRoomRequest } from '@/apis/room';

const FACULTY_KEY = ['faculties-manage'];
const ROOM_KEY = ['rooms-manage'];

// ── Faculty hooks ──────────────────────────────────────────────
export const useFacultiesManage = () =>
  useQuery({
    queryKey: FACULTY_KEY,
    queryFn: () => facultyApi.getFaculties(true), // with-rooms=true
    select: (res) => res.faculties,
  });

export const useCreateFaculty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFacultyRequest) => facultyApi.createFaculty(data),
    onSuccess: () => {
      toast.success('Tạo khoa thành công!');
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
    },
    onError: () => toast.error('Tạo khoa thất bại.'),
  });
};

export const useUpdateFaculty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFacultyRequest }) =>
      facultyApi.updateFaculty(id, data),
    onSuccess: () => {
      toast.success('Cập nhật khoa thành công!');
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
    },
    onError: () => toast.error('Cập nhật khoa thất bại.'),
  });
};

export const useDeleteFaculty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facultyApi.deleteFaculty(id),
    onSuccess: () => {
      toast.success('Đã xóa khoa!');
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
      qc.invalidateQueries({ queryKey: ROOM_KEY });
    },
    onError: () => toast.error('Xóa khoa thất bại.'),
  });
};

// ── Room hooks ─────────────────────────────────────────────────
export const useRoomsManage = () =>
  useQuery({
    queryKey: ROOM_KEY,
    queryFn: () => roomApi.getRooms(),
  });

export const useCreateRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoomRequest) => roomApi.createRoom(data),
    onSuccess: () => {
      toast.success('Tạo phòng thành công!');
      qc.invalidateQueries({ queryKey: ROOM_KEY });
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
    },
    onError: () => toast.error('Tạo phòng thất bại.'),
  });
};

export const useUpdateRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoomRequest }) =>
      roomApi.updateRoom(id, data),
    onSuccess: () => {
      toast.success('Cập nhật phòng thành công!');
      qc.invalidateQueries({ queryKey: ROOM_KEY });
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
    },
    onError: () => toast.error('Cập nhật phòng thất bại.'),
  });
};

export const useDeleteRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roomApi.deleteRoom(id),
    onSuccess: () => {
      toast.success('Đã xóa phòng!');
      qc.invalidateQueries({ queryKey: ROOM_KEY });
      qc.invalidateQueries({ queryKey: FACULTY_KEY });
    },
    onError: () => toast.error('Xóa phòng thất bại.'),
  });
};

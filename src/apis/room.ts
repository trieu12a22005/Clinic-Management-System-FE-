import { apiClient } from './axios';

export interface RoomOption {
  roomID: string;
  roomName: string | null;
  roomType?: string;
  status?: string;
  FacultyID?: string;
  faculty?: { facultyID: string; facultyName: string };
}

export interface CreateRoomRequest {
  roomName: string;
  roomType: string;
  FacultyID?: string;
}

export interface UpdateRoomRequest {
  roomName?: string;
  roomType?: string;
  FacultyID?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

type RoomsApiResponse = {
  rooms?: unknown[];
  data?: unknown;
  items?: unknown[];
};

const normalizeRoom = (item: unknown): RoomOption | null => {
  if (!item || typeof item !== 'object') return null;
  const room = item as Record<string, unknown>;
  if (typeof room.roomID !== 'string') return null;
  return {
    roomID: room.roomID,
    roomName: typeof room.roomName === 'string' ? room.roomName : null,
    roomType: typeof room.roomType === 'string' ? room.roomType : undefined,
    status: typeof room.status === 'string' ? room.status : undefined,
    FacultyID: typeof room.FacultyID === 'string' ? room.FacultyID : undefined,
    faculty: room.faculty as RoomOption['faculty'],
  };
};

const extractRooms = (response: RoomsApiResponse | unknown): RoomOption[] => {
  const payload =
    Array.isArray(response)
      ? response
      : Array.isArray((response as RoomsApiResponse)?.rooms)
        ? (response as RoomsApiResponse).rooms
        : Array.isArray((response as RoomsApiResponse)?.items)
          ? (response as RoomsApiResponse).items
          : Array.isArray((response as RoomsApiResponse)?.data)
            ? ((response as RoomsApiResponse).data as unknown[])
            : [];

  return (payload ?? [])
    .map(normalizeRoom)
    .filter((room): room is RoomOption => room !== null);
};

class RoomApi {
  /** Lấy tất cả phòng */
  async getRooms(): Promise<RoomOption[]> {
    const response = await apiClient.get<RoomsApiResponse>('/admin/rooms');
    return extractRooms(response.data);
  }

  /** Lấy phòng theo khoa */
  async getRoomsByFaculty(facultyID: string): Promise<RoomOption[]> {
    const response = await apiClient.get<RoomsApiResponse>(`/admin/rooms/faculty/${facultyID}`);
    return extractRooms(response.data);
  }

  /** Tạo phòng mới */
  async createRoom(data: CreateRoomRequest): Promise<{ room: RoomOption }> {
    const response = await apiClient.post('/admin/rooms', data);
    return response.data;
  }

  /** Cập nhật phòng */
  async updateRoom(id: string, data: UpdateRoomRequest): Promise<{ message: string; room: RoomOption }> {
    const response = await apiClient.patch(`/admin/rooms/${id}`, data);
    return response.data;
  }

  /** Xóa phòng */
  async deleteRoom(id: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/admin/rooms/${id}`);
    return response.data;
  }

  /** Xóa nhiều phòng */
  async deleteManyRooms(roomIds: string[]): Promise<{ message: string; deletedCount: number }> {
    const response = await apiClient.post('/admin/rooms/delete-many', { roomIds });
    return response.data;
  }
}

const roomApi = new RoomApi();
export default roomApi;

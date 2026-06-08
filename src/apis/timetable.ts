import { apiClient } from './axios';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimetableAccount {
  accountID: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: {
    roleID: string;
    roleName: string;
    roleDescription?: string;
  };
  avatarUrl?: string;
  DisplayID?: string;
}

export interface TimetableRoom {
  roomID: string;
  roomName: string | null;
  roomType: string;
  faculty?: {
    facultyID: string;
    facultyName: string;
    status: string;
  };
}

export interface TimetableObject {
  timeID: string;
  accountID: string;
  roomID: string;
  dayOfWeek: DayOfWeek;
  note: string | null;
  createdAt: string;
  account: TimetableAccount;
  room: TimetableRoom;
}

export interface CreateTimetableRequest {
  accountID: string;
  dayOfWeek: DayOfWeek;
  note?: string;
  roomID?: string;
  facultyID?: string;
}

export interface TimetableResponse {
  timetable: TimetableObject;
}

export interface GroupedTimetablesResponse {
  timetables: Record<DayOfWeek, TimetableObject[]>;
}

export interface AvailableUsersResponse {
  users: TimetableAccount[];
}

export interface DeleteManyTimetablesResponse {
  message: string;
  deletedCount: number;
}

class TimeTableApi {
  /**
   * Create a new timetable entry
   */
  async createTimetable(data: CreateTimetableRequest): Promise<TimetableResponse> {
    const response = await apiClient.post('/admin/timetables', data);
    return response.data;
  }

  /**
   * Get all timetable entries of a faculty, grouped by day of week
   * @param facultyID - Optional faculty ID to filter timetables
   */
  async getAllTimetables(facultyID?: string): Promise<GroupedTimetablesResponse> {
    const response = await apiClient.get('/admin/timetables', {
      params: facultyID ? { facultyID } : undefined,
    });
    return response.data;
  }

  /**
   * Get a timetable entry by ID
   */
  async getTimetableById(id: string): Promise<TimetableResponse> {
    const response = await apiClient.get(`/admin/timetables/${id}`);
    return response.data;
  }

  /**
   * Get all timetable entries for a specific doctor
   */
  async getTimetableByDoctor(accountID: string): Promise<{ timetables: TimetableObject[] }> {
    const response = await apiClient.get(`/admin/timetables/doctor/${accountID}`);
    return response.data;
  }

  /**
   * Get all timetable entries for a specific doctor on a specific day
   */
  async getTimetableByDay(accountID: string, dayOfWeek: DayOfWeek | string): Promise<{ timetables: TimetableObject[] }> {
    const response = await apiClient.get(`/admin/timetables/doctor/${accountID}/day/${dayOfWeek}`);
    return response.data;
  }

  /**
   * Get available users from a faculty
   * @param facultyID - Required faculty ID to get all users in that faculty
   */
  async getAvailableUsers(facultyID: string): Promise<AvailableUsersResponse> {
    const response = await apiClient.get('/admin/timetables/available-users', {
      params: { facultyID },
    });
    return response.data;
  }

  /**
   * Update a timetable entry by ID
   * @param facultyID - Optional facultyID query param to auto-select an available room
   */
  async updateTimetable(id: string, data: Partial<CreateTimetableRequest>, facultyID?: string): Promise<TimetableResponse & { message: string }> {
    const response = await apiClient.patch(`/admin/timetables/${id}`, data, {
      params: facultyID ? { facultyID } : undefined,
    });
    return response.data;
  }

  /**
   * Delete a timetable entry by ID
   */
  async deleteTimetable(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`/admin/timetables/${id}`);
    return response.data;
  }

  /**
   * Delete multiple timetable entries
   */
  async deleteManyTimetables(timeIds: string[]): Promise<DeleteManyTimetablesResponse> {
    const response = await apiClient.delete('/admin/timetables/delete-many', {
      data: { timeIds },
    });
    return response.data;
  }
}

const timeTableApi = new TimeTableApi();
export default timeTableApi;

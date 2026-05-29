import { apiClient } from './axios';

export interface Room {
  roomID: string;
  roomName: string | null;
  roomType: string;
  FacultyID: string;
  status: string;
}

export interface Faculty {
  facultyID: string;
  facultyName: string;
  facultyDescription: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  rooms?: Room[];
}

export interface CreateFacultyRequest {
  facultyName: string;
  facultyDescription?: string;
  rooms?: any; // Based on controller, it can accept rooms data
}

export interface UpdateFacultyRequest {
  facultyName?: string;
  facultyDescription?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface FacultyResponse {
  faculty: Faculty;
}

export interface AllFacultiesResponse {
  faculties: Faculty[];
}

export interface DeleteManyFacultyResult {
  id: string;
  status: 'deleted' | 'failed' | 'not found';
  message?: string;
}

export interface DeleteManyFacultyResponse {
  message: string;
  results: DeleteManyFacultyResult[];
}

class FacultyApi {
  /**
   * Create a new faculty
   */
  async createFaculty(data: CreateFacultyRequest): Promise<FacultyResponse> {
    const response = await apiClient.post('/admin/faculty', data);
    return response.data;
  }

  /**
   * Get all faculties
   * @param withRooms - If true, includes the list of rooms associated with each faculty
   */
  async getFaculties(withRooms: boolean = false): Promise<AllFacultiesResponse> {
    const response = await apiClient.get('/admin/faculty', {
      params: { 'with-rooms': withRooms },
    });
    return response.data;
  }

  /**
   * Get a specific faculty by ID
   */
  async getFacultyById(id: string): Promise<FacultyResponse> {
    const response = await apiClient.get(`/admin/faculty/${id}`);
    return response.data;
  }

  /**
   * Update faculty details by ID
   */
  async updateFaculty(id: string, data: UpdateFacultyRequest): Promise<{ message: string; data: UpdateFacultyRequest }> {
    const response = await apiClient.patch(`/admin/faculty/${id}`, data);
    return response.data;
  }

  /**
   * Delete a faculty by ID (Soft delete - sets status to INACTIVE)
   * Note: Backend uses POST for this operation
   */
  async deleteFaculty(id: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/admin/faculty/${id}`);
    return response.data;
  }

  /**
   * Delete multiple faculties (Soft delete)
   * Note: Backend uses POST for this operation and expects 'FacultyIds'
   */
  async deleteManyFaculties(facultyIds: string[]): Promise<DeleteManyFacultyResponse> {
    const response = await apiClient.post('/admin/faculty/delete-many', {
      FacultyIds: facultyIds,
    });
    return response.data;
  }
}

const facultyApi = new FacultyApi();
export default facultyApi;

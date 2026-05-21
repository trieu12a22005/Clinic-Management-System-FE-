import { apiClient } from './axios';
class TimeTableApi {
  async getTimetable(accountID: string) {
    const response = await apiClient.get(`/admin/timetables/doctor/${accountID}`);
    return response.data;
  }
  async getAllTimetable() {
    const response = await apiClient.get(`/admin/timetables`);
    return response.data;
  }
  async getTimetableByDay(accountID: string, dayOfWeek: string) {
    const response = await apiClient.get(`/admin/timetables/doctor/${accountID}/day/${dayOfWeek}`);
    return response.data;
  }
}

const timeTableApi = new TimeTableApi();
export default timeTableApi;
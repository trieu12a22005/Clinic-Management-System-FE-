import { useEffect, useState } from 'react';
import facultyApi from '../../apis/faculty';
import type { Faculty } from '../../apis/faculty';
import ScheduleTable from './components/ScheduleTable';

const SchedulePage = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                // Fetch faculties with their rooms to know the capacity
                const response = await facultyApi.getFaculties(true);
                setFaculties(response.faculties);
                
                // Select the first faculty by default as requested
                if (response.faculties && response.faculties.length > 0) {
                    setSelectedFacultyId(response.faculties[0].facultyID);
                }
            } catch (error) {
                console.error("Failed to fetch faculties:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaculties();
    }, []);

    const selectedFaculty = faculties.find(f => f.facultyID === selectedFacultyId);

    if (loading) {
        return (
            <div className="p-10 flex justify-center items-center h-full">
                <div className="animate-pulse text-gray-500 font-medium">Đang tải danh sách khoa...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lịch phân công hàng tuần</h1>
                    <p className="text-gray-500 text-sm mt-1">Theo dõi và quản lý lịch phân công của các khoa</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <label htmlFor="faculty-select" className="pl-2 font-semibold text-gray-600 text-sm tracking-wider">
                        Khoa
                    </label>
                    <select
                        id="faculty-select"
                        value={selectedFacultyId}
                        onChange={(e) => setSelectedFacultyId(e.target.value)}
                        className="border-none rounded-md px-3 py-1.5 bg-gray-50 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
                    >
                        {faculties.map((faculty) => (
                            <option key={faculty.facultyID} value={faculty.facultyID}>
                                {faculty.facultyName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedFacultyId ? (
                <ScheduleTable 
                    facultyID={selectedFacultyId} 
                    facultyName={selectedFaculty?.facultyName || ''} 
                    roomCount={selectedFaculty?.rooms?.length || 0}
                />
            ) : (
                <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-center py-20">
                    <p>Không tìm thấy dữ liệu khoa.</p>
                </div>
            )}
        </div>
    );
};

export default SchedulePage;

import facultyApi from '@/apis/faculty';
import type { Faculty } from '@/apis/faculty';
import { useQuery } from '@tanstack/react-query';
const FacultyService = () =>{
    const query = useQuery({
        queryKey: ['faculty'],
        queryFn: async () => {
            const res = await facultyApi.getFaculties();
            return res.faculties as Faculty[];
        }
    });
    return {
        faculties: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
export default FacultyService;
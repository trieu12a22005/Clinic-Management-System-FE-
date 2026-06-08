import facultyApi from '@/apis/faculty';
import type { Faculty } from '@/apis/faculty';
import { useQuery } from '@tanstack/react-query';
import { useCheckPermission } from '@/hooks/useCheckPermission';

const FacultyService = () => {
    const { hasPermission } = useCheckPermission();
    const canViewFaculty = hasPermission(['faculty.view', 'faculty.manage']);

    const query = useQuery({
        queryKey: ['faculty'],
        queryFn: async () => {
            const res = await facultyApi.getFaculties();
            return res.faculties as Faculty[];
        },
        // Chỉ fetch khi user có quyền faculty.view hoặc faculty.manage
        enabled: canViewFaculty,
    });
    return {
        faculties: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
export default FacultyService;
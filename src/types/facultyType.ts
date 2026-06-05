import type { Faculty } from "@/apis/faculty";

export type { Faculty };

export interface FacultyFilterProps {
  faculties: Faculty[];
  activeFacultyId: string | null;
  onSelectFaculty: (facultyId: string | null) => void;
};
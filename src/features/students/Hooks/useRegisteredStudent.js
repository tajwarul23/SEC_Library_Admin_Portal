import { useQuery } from "@tanstack/react-query";
import {
  getRegisteredStudentsApi,
  searchRegisteredStudentsApi,
  getStudentDetailsApi
} from "../Services/RegisteredStudent.api.js";

/**
 * Hook to get one server-paginated, server-filtered page of registered
 * students (User where role === "user"). Kept as a separate query key from
 * ["students", ...] since it's a different collection (User vs
 * StudentAuthentication) with its own cache lifecycle.
 */
export function useGetRegisteredStudents({ page = 1, limit = 10, department = "All", Session = "All" } = {}) {
  return useQuery({
    queryKey: ["registeredStudents", { page, limit, department, Session }],
    queryFn: () => getRegisteredStudentsApi({ page, limit, department, Session }),
    select: (response) => ({ students: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to search registered students (User, role: "user") server-side by
 * name/regNo/email, with real server-side pagination (unlike AllStudentsTab's
 * search, which returns its whole match set unpaginated). Disabled until a
 * non-empty query is passed.
 */
export function useSearchRegisteredStudents({ query, page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["registeredStudents", "search", query, { page, limit }],
    queryFn: () => searchRegisteredStudentsApi({ query, page, limit }),
    select: (response) => ({ students: response.data, pagination: response.pagination }),
    enabled: !!query && query.trim().length > 0,
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to fetch one registered student's full profile + issued/reservation
 * history by regNo (POST /admin/access/students/search). Only enabled once
 * a regNo is selected, so it never fires on table load — just on row click.
 */
export function useGetStudentDetails(regNo) {
  return useQuery({
    queryKey: ["studentDetails", regNo],
    queryFn: () => getStudentDetailsApi(regNo),
    enabled: !!regNo
  });
}

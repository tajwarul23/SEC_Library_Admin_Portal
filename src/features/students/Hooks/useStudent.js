import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudentsApi,
  createStudentApi,
  deleteStudentApi,
  searchStudentsApi
} from "../Services/Student.api.js";
import toast from "react-hot-toast";

/**
 * Hook to get one server-paginated, server-filtered page of the
 * StudentAuthentication roster (department/Session filters are applied
 * server-side).
 */
export function useGetStudents(params = {}) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudentsApi(params),
    select: (response) => ({ students: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to search the full StudentAuthentication roster server-side
 * (name/gmail/regNo via POST /main/student/search). Not paginated by the
 * backend — returns the whole match set at once. Disabled until a
 * non-empty query is passed.
 */
export function useSearchStudents(query) {
  return useQuery({
    queryKey: ["students", "search", query],
    queryFn: () => searchStudentsApi(query),
    select: (response) => response.data,
    enabled: !!query && query.trim().length > 0,
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success(response.message || "Student created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create student");
    }
  });
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudentApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success(response.message || "Student deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete student");
    }
  });
}

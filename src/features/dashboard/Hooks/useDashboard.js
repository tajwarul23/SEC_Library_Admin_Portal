import { useQuery } from "@tanstack/react-query";
import {
  getBookStatsApi,
  getIssueStatsApi,
  getReservationStatsApi,
  getOverdueIssueStatsApi
} from "../Services/Dashboard.api.js";
import { getStudentsApi } from "../../students/Services/Student.api.js";
import { getRegisteredStudentsApi } from "../../students/Services/RegisteredStudent.api.js";

/**
 * Small standalone stat-endpoint hooks, exported so components like
 * Header/Sidebar can badge an accurate count without pulling a
 * (now-paginated, default-limit-3) full record list just to read its
 * .length. Same query keys as useGetDashboardStats below, so react-query
 * dedupes/shares the request instead of firing it twice.
 */
export function useGetIssueStats() {
  return useQuery({ queryKey: ["stats", "issued"], queryFn: getIssueStatsApi });
}
export function useGetReservationStats() {
  return useQuery({ queryKey: ["stats", "reservations"], queryFn: getReservationStatsApi });
}
export function useGetOverdueStats() {
  return useQuery({ queryKey: ["stats", "overdue"], queryFn: getOverdueIssueStatsApi });
}

/**
 * Combines the four backend stat endpoints with two student-count queries
 * into one shape the Overview page can render. Each source is a separate
 * query, so one slow/failing endpoint doesn't block the others from
 * rendering.
 *
 * The two student counts read different collections and mean different
 * things:
 *   - totalStudents: StudentAuthentication roster — everyone eligible to
 *     register, whether or not they ever have.
 *   - totalRegisteredStudents: User where role === "user" — students who
 *     have actually logged in and are using the library portal.
 */
export function useGetDashboardStats() {
  const bookStats = useQuery({ queryKey: ["stats", "books"], queryFn: getBookStatsApi });
  const issueStats = useGetIssueStats();
  const reservationStats = useGetReservationStats();
  const overdueStats = useGetOverdueStats();
  // Cheapest way to get each real count without pulling the whole roster.
  const studentCount = useQuery({
    queryKey: ["students", { page: 1, limit: 1 }],
    queryFn: () => getStudentsApi({ page: 1, limit: 1 }),
    select: (response) => response.pagination?.totalStudents ?? 0
  });
  const registeredStudentCount = useQuery({
    queryKey: ["registeredStudents", { page: 1, limit: 1, department: "All", Session: "All" }],
    queryFn: () => getRegisteredStudentsApi({ page: 1, limit: 1 }),
    select: (response) => response.pagination?.totalStudents ?? 0
  });

  const isLoading =
    bookStats.isLoading ||
    issueStats.isLoading ||
    reservationStats.isLoading ||
    overdueStats.isLoading ||
    studentCount.isLoading ||
    registeredStudentCount.isLoading;
  const isError =
    bookStats.isError ||
    issueStats.isError ||
    reservationStats.isError ||
    overdueStats.isError ||
    studentCount.isError ||
    registeredStudentCount.isError;
  const error =
    bookStats.error ||
    issueStats.error ||
    reservationStats.error ||
    overdueStats.error ||
    studentCount.error ||
    registeredStudentCount.error;

  return {
    isLoading,
    isError,
    error,
    data: {
      totalBookTitles: bookStats.data?.totalBookTitles ?? 0,
      totalCopies: bookStats.data?.totalCopies ?? 0,
      availableCopies: bookStats.data?.availableCopies ?? 0,
      totalStudents: studentCount.data ?? 0,
      totalRegisteredStudents: registeredStudentCount.data ?? 0,
      activeIssued: issueStats.data?.activeIssued ?? 0,
      activeReservations: reservationStats.data?.activeReservations ?? 0,
      overdueCount: overdueStats.data?.overdueCount ?? 0
    }
  };
}

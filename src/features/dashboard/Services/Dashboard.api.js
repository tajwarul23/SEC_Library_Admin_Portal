import { apiClient } from "../../../services/apiClient.js";

// Backend split dashboard stats into four focused endpoints instead of one.
// Student counts aren't among them — the dashboard needs two separate
// counts (StudentAuthentication roster vs. registered User portal
// accounts), so those are pulled from getStudentsApi and
// getRegisteredStudentsApi's pagination totals instead (see
// useDashboard.js).

export async function getBookStatsApi() {
  const response = await apiClient.get("/admin/access/stats/books");
  return response.data; // { totalBookTitles, totalCopies, availableCopies, issuedCopies }
}

export async function getIssueStatsApi() {
  const response = await apiClient.get("/admin/access/stats/issued");
  return response.data; // { totalIssued, activeIssued, totalReturned }
}

export async function getReservationStatsApi() {
  const response = await apiClient.get("/admin/access/stats/reservations");
  return response.data; // { totalReservations, activeReservations, expiredReservations, issuedReservations }
}

export async function getOverdueIssueStatsApi() {
  const response = await apiClient.get("/admin/access/stats/overdue");
  return response.data; // { overdueCount }
}

import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/reservations?status=&regNo=&bookId=&offset=&limit=
// Now server-paginated (defaults to limit=3 if omitted), so callers that
// want more than a handful of records must pass offset/limit explicitly.
export async function getReservationsApi({ status, regNo, bookId, offset = 0, limit = 10 } = {}) {
  const params = { offset, limit };
  if (status) params.status = status;
  if (regNo) params.regNo = regNo;
  if (bookId) params.bookId = bookId;

  const response = await apiClient.get("/admin/access/reservations", { params });
  return {
    data: response.data,
    pagination: {
      count: response.count,
      total: response.totalReservations,
      pageCount: response.pageCount,
      offset: response.offset,
      limit: response.limit
    },
    message: "Reservations retrieved successfully"
  };
}

// NOTE: there is no cancel-reservation endpoint on the backend
// (confirmed — no POST /admin/access/reservations/:id/cancel route exists
// anywhere in admin-access-route.js) and none is planned. To convert a
// pending reservation into an issued book instead, use
// useIssueReservedBook from features/issue/Hooks/useIssue.js.

import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/issued?status=&regNo=&bookId=&offset=&limit=
// Now server-paginated (defaults to limit=3 if omitted), so callers that
// want more than a handful of records must pass offset/limit explicitly.
export async function getIssuedBooksApi({ status, regNo, bookId, offset = 0, limit = 10 } = {}) {
  const params = { offset, limit };
  if (status) params.status = status;
  if (regNo) params.regNo = regNo;
  if (bookId) params.bookId = bookId;

  const response = await apiClient.get("/admin/access/issued", { params });
  return {
    data: response.data,
    pagination: {
      count: response.count,
      total: response.totalIssued,
      pageCount: response.pageCount,
      offset: response.offset,
      limit: response.limit
    },
    message: "Issued books retrieved successfully"
  };
}

// Backend: POST /api/admin/access/books/:bookId/issue-to   Body: { regNo }
// Direct issue, no reservation required. The backend auto-sets borrowedAt
// (now) and dueDate (+7 days) — there is no way to pass a custom due date,
// and the student is looked up by regNo, not a Mongo _id. Enforces a 3-book
// borrowing limit and blocks duplicate active issues server-side.
export async function issueBookDirectApi({ bookId, regNo }) {
  const response = await apiClient.post(`/admin/access/books/${bookId}/issue-to`, { regNo });
  return { data: response.data, message: response.message };
}

// Backend: POST /api/admin/access/books/:bookId/issue/:reservationId
// Converts an existing pending reservation into an issued book.
export async function issueReservedBookApi({ bookId, reservationId }) {
  const response = await apiClient.post(`/admin/access/books/${bookId}/issue/${reservationId}`);
  return { data: response.data, message: response.message };
}

// Backend: POST /api/admin/access/issued/:issuedId/return
// :issuedId is the IssuedBook's Mongo _id.
export async function returnIssuedBookApi(issuedId) {
  const response = await apiClient.post(`/admin/access/issued/${issuedId}/return`);
  return { data: response.issuedBook, book: response.book, message: response.message };
}

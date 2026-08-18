import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/students?offset=&limit=&department=&Session=
// Reads registered library-portal accounts (User where role === "user") —
// a different collection from StudentAuthentication. This is the roster of
// students who have actually logged in and registered, not just the
// admin-added authentication list.
// UI stays in page/limit terms; offset is derived here so callers never
// need to think in offsets. "All" is the FilterBar's sentinel for "no
// filter" and is intentionally NOT sent to the backend.
export async function getRegisteredStudentsApi({ page = 1, limit = 10, department, Session } = {}) {
  const offset = (page - 1) * limit;
  const params = { offset, limit };
  if (department && department !== "All") params.department = department;
  if (Session && Session !== "All") params.Session = Session;

  const response = await apiClient.get("/admin/access/students", { params });
  return {
    data: response.data,
    pagination: {
      page,
      limit,
      totalStudents: response.totalStudents,
      pageCount: response.pageCount,
      hasNextPage: page < response.pageCount,
      hasPreviousPage: page > 1
    }
  };
}

// Backend: GET /api/admin/access/students/search?query=&offset=&limit=
// Server-side paginated text search across name/regNo/email for registered
// (User, role: "user") students. Unlike AllStudentsTab's search endpoint,
// this one IS paginated by the backend — but it does NOT support
// department/Session filtering, so those two stay browse-mode only.
export async function searchRegisteredStudentsApi({ query, page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;
  const response = await apiClient.get("/admin/access/students/search", {
    params: { query, offset, limit }
  });
  return {
    data: response.data,
    pagination: {
      page,
      limit,
      totalStudents: response.totalStudents,
      pageCount: response.pageCount,
      hasNextPage: page < response.pageCount,
      hasPreviousPage: page > 1
    }
  };
}

// Backend: POST /api/admin/access/students/search
// Body: { regNo }
// Detailed lookup for ONE registered student — full profile plus their
// issued-book and reservation history. This is a lookup endpoint, not a
// listing-search endpoint, so it's only used by the details modal after a
// row click, never for the Registered Students table itself.
export async function getStudentDetailsApi(regNo) {
  const response = await apiClient.post("/admin/access/students/search", { regNo });
  return {
    student: response.student,
    issuedBooks: response.issuedBooks || [],
    reservations: response.reservations || []
  };
}

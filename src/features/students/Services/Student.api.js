import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/main/student/all?offset=&limit=&department=&Session=
// Reads the StudentAuthentication roster directly — this is the real
// student directory. (User is only created when a student logs in with
// Gmail, which isn't built yet, so User stays empty/irrelevant for now.)
// Fields on each record: _id, name, gmail, regNo, gender, Session, department.
// UI stays in page/limit terms; offset is derived here so callers never
// need to think in offsets. "All" is the FilterBar's sentinel for "no
// filter" and is intentionally NOT sent to the backend.
export async function getStudentsApi({ page = 1, limit = 10, department, Session } = {}) {
  const offset = (page - 1) * limit;
  const params = { offset, limit };
  if (department && department !== "All") params.department = department;
  if (Session && Session !== "All") params.Session = Session;

  const response = await apiClient.get("/main/student/all", { params });
  return {
    data: response.data,
    pagination: {
      page,
      limit,
      totalStudents: response.pagination?.totalStudents,
      pageCount: response.pagination?.pageCount,
      hasNextPage: page < response.pagination?.pageCount,
      hasPreviousPage: page > 1
    },
    message: response.message
  };
}

// Backend: POST /api/main/student/add
// Body: { name, gmail, regNo, gender: "Male"|"Female"|"Hijra", Session, department }
// All fields required. Rejects duplicate gmail, regNo, or name.
export async function createStudentApi(data) {
  const response = await apiClient.post("/main/student/add", data);
  return { data: response.data, message: response.message };
}

// Backend: DELETE /api/main/student/delete/:id  (StudentAuthentication _id —
// now the same _id the directory list actually returns, so no more
// User/StudentAuthentication id mismatch).
export async function deleteStudentApi(studentId) {
  const response = await apiClient.delete(`/main/student/delete/${studentId}`);
  return { message: response.message };
}

// Backend: POST /api/main/student/search
// Body: { query } — searches name, gmail, regNo across the full
// StudentAuthentication roster. Not paginated — returns the whole match set
// in one response, and does not support department/session filtering.
export async function searchStudentsApi(query) {
  const response = await apiClient.post("/main/student/search", { query });
  return { data: response.data, message: response.message };
}

// No fine-payment endpoint exists on the backend, and none is planned.

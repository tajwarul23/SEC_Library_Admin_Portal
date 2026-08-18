import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/research-papers/search?query=&category=&status=&page=&limit=
// query, category and status are all optional. For an admin caller with no
// status set, the backend applies no status filter at all — pending/approved/
// rejected papers are all returned mixed together — so `status` lets the UI
// scope the "All Papers" view down to one bucket when needed.
export async function getResearchPapersApi({ query, category, status, page = 1, limit = 10 } = {}) {
  const params = { page, limit };
  if (query && query.trim()) params.query = query.trim();
  if (category && category !== "ALL") params.category = category;
  if (status && status !== "ALL") params.status = status;

  const response = await apiClient.get("/admin/access/research-papers/search", { params });
  return {
    data: response.papers,
    pagination: response.pagination
  };
}

// Backend: GET /api/admin/access/research-papers/pending?page=&limit=
// Dedicated queue of papers students submitted that are awaiting an
// approve/reject decision.
export async function getPendingResearchPapersApi({ page = 1, limit = 10 } = {}) {
  const response = await apiClient.get("/admin/access/research-papers/pending", { params: { page, limit } });
  return {
    data: response.papers,
    pagination: response.pagination
  };
}

// Backend: POST /api/admin/access/research-papers/create
// Required: title, authors (array of { name, affiliation?, orcid? } — at
// least one with a non-empty name), category (CSE/EEE/CE/ME/PHYSICS/
// CHEMISTRY/MATH/BIOLOGY/GENERAL), paperLink.
// Optional: abstract, keywords (array of strings), publicationDate (date),
// journalName, conferenceName, doi (must be globally unique if set).
// Papers created here are saved with status "approved" directly (admin is
// the source, no review step needed).
export async function createResearchPaperApi(data) {
  const response = await apiClient.post("/admin/access/research-papers/create", data);
  return { data: response.paper, message: response.message };
}

// Backend: PATCH /api/admin/access/research-papers/:id — same field shape as
// create, plus an optional `status` (pending/approved/rejected) for manually
// overriding a submission's review state outside the approve/reject actions.
export async function updateResearchPaperApi({ paperId, data }) {
  const response = await apiClient.patch(`/admin/access/research-papers/${paperId}`, data);
  return { data: response.paper, message: response.message };
}

// Backend: DELETE /api/admin/access/research-papers/:id
export async function deleteResearchPaperApi(paperId) {
  const response = await apiClient.delete(`/admin/access/research-papers/${paperId}`);
  return { message: response.message };
}

// Backend: POST /api/admin/access/research-papers/approve/:id
export async function approveResearchPaperApi(paperId) {
  const response = await apiClient.post(`/admin/access/research-papers/approve/${paperId}`);
  return { data: response.paper, message: response.message };
}

// Backend: POST /api/admin/access/research-papers/reject/:id — body: { reason? }
export async function rejectResearchPaperApi({ paperId, reason }) {
  const response = await apiClient.post(`/admin/access/research-papers/reject/${paperId}`, { reason });
  return { data: response.paper, message: response.message };
}

import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/books?offset=&limit=&category=&availability=
// category is an exact match against Book.category. availability is
// "available" (availableCopies > 0) or "unavailable" (availableCopies === 0);
// omit for no availability filter.
export async function getBooksApi({ offset = 0, limit = 10, category, availability } = {}) {
  const params = { offset, limit };
  if (category && category !== "ALL") params.category = category;
  if (availability && availability !== "ALL") params.availability = availability;

  const response = await apiClient.get("/admin/access/books", { params });
  return {
    data: response.data,
    message: response.message,
    pagination: {
      count: response.count,
      total: response.totalBooks,
      pageCount: response.pageCount,
      offset: response.offset,
      limit: response.limit
    }
  };
}

// Backend: GET /api/admin/access/books/search?query=&offset=&limit=
// Searches title, authors, category, isbn. Now server-paginated — does NOT
// accept category/availability alongside the query.
export async function searchBooksApi({ query, offset = 0, limit = 10 } = {}) {
  const response = await apiClient.get("/admin/access/books/search", {
    params: { query, offset, limit }
  });
  return {
    data: response.data,
    pagination: {
      count: response.count,
      total: response.totalMatches,
      pageCount: response.pageCount,
      offset: response.offset,
      limit: response.limit
    }
  };
}

// Backend: POST /api/admin/access/books
// Required: title, authors (array of strings) OR author (string, back-compat),
// isbn, totalCopies (int), availableCopies (int, <= totalCopies).
// Optional: category (one of CSE/EEE/CE/PHYSICS/CHEMISTRY/GENERAL/MATH/ARTS,
// defaults GENERAL), coverImage: { url, publicId }.
export async function createBookApi(data) {
  const response = await apiClient.post("/admin/access/books", data);
  return { data: response.book, message: response.message };
}

// Backend: PATCH /api/admin/access/books/:id
// All fields optional/partial — only send what changed.
export async function updateBookApi({ bookId, data }) {
  const response = await apiClient.patch(`/admin/access/books/${bookId}`, data);
  return { data: response.book, message: response.message };
}

// Backend: DELETE /api/admin/access/books/:id
export async function deleteBookApi(bookId) {
  const response = await apiClient.delete(`/admin/access/books/${bookId}`);
  return { message: response.message };
}

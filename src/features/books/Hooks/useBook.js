import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBooksApi,
  searchBooksApi,
  createBookApi,
  updateBookApi,
  deleteBookApi
} from "../Services/Book.api.js";
import toast from "react-hot-toast";

/**
 * Hook to get one server-paginated page of books.
 * Pass { offset, limit } for real pagination (the catalog table); pass a
 * generous { limit } alone for a one-shot batch to search client-side
 * (e.g. IssueBookForm's picker — same pattern as useGetStudents there).
 */
export function useGetBooks(params = {}) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooksApi(params),
    select: (response) => ({ books: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to search the full catalog server-side (title/authors/category/isbn
 * via GET /admin/access/books/search), server-paginated same as
 * useGetBooks. Disabled until a non-empty query is passed.
 */
export function useSearchBooks({ query, offset = 0, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["books", "search", query, { offset, limit }],
    queryFn: () => searchBooksApi({ query, offset, limit }),
    select: (response) => ({ books: response.data, pagination: response.pagination }),
    enabled: !!query && query.trim().length > 0,
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to create a new book
 */
export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBookApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["stats", "books"] });
      toast.success(response.message || "Book added to catalog");
    },
    onError: (error) => {
      toast.error(error.data?.error || error.message || "Failed to add book");
    },
  });
}

/**
 * Hook to update a book
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBookApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["stats", "books"] });
      toast.success(response.message || "Book updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update book");
    }
  });
}

/**
 * Hook to delete a book
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBookApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["stats", "books"] });
      toast.success(response.message || "Book deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete book");
    }
  });
}

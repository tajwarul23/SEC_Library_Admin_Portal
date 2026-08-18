import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIssuedBooksApi,
  issueBookDirectApi,
  issueReservedBookApi,
  returnIssuedBookApi
} from "../Services/Issue.api.js";
import toast from "react-hot-toast";

export function useGetIssuedBooks(filters = {}) {
  return useQuery({
    queryKey: ["issuedBooks", filters],
    queryFn: () => getIssuedBooksApi(filters),
    select: response => ({ issuedBooks: response.data, pagination: response.pagination }),
    placeholderData: previousData => previousData
  });
}


// Issue directly by regNo (no prior reservation).
export function useIssueBookDirect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: issueBookDirectApi, // { bookId, regNo }
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["issuedBooks"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({queryKey:["stats","issued"]})
      toast.success(response.message || "Book issued successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to issue book");
    }
  });
}

// Convert a pending reservation into an issued book.
export function useIssueReservedBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: issueReservedBookApi, // { bookId, reservationId }
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["issuedBooks"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({queryKey:["stats","issued"]})
      toast.success(response.message || "Book issued successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to issue reserved book");
    }
  });
}

export function useReturnIssuedBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnIssuedBookApi, // issuedId (Mongo _id)
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: ["issuedBooks"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({queryKey:["stats","issued"]})
      queryClient.invalidateQueries({queryKey:["stats","overdue"]})
      toast.success(response.message || "Book returned successfully");
    },
    onError: error => {
      toast.error(error.message || "Failed to return book");
    }
  });
}

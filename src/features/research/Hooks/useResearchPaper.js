import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResearchPapersApi,
  getPendingResearchPapersApi,
  createResearchPaperApi,
  updateResearchPaperApi,
  deleteResearchPaperApi,
  approveResearchPaperApi,
  rejectResearchPaperApi
} from "../Services/ResearchPaper.api.js";
import toast from "react-hot-toast";

/**
 * Hook to get one server-paginated, server-filtered page of research papers
 * (GET /admin/access/research-papers/search). query/category are optional,
 * so passing neither just browses the full published set.
 */
export function useGetResearchPapers(params = {}) {
  return useQuery({
    queryKey: ["researchPapers", params],
    queryFn: () => getResearchPapersApi(params),
    select: (response) => ({ papers: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData
  });
}

/**
 * Hook to get one server-paginated page of the pending-review queue
 * (GET /admin/access/research-papers/pending).
 */
export function usePendingResearchPapers(params = {}) {
  return useQuery({
    queryKey: ["researchPapers", "pending", params],
    queryFn: () => getPendingResearchPapersApi(params),
    select: (response) => ({ papers: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData
  });
}

export function useCreateResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResearchPaperApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["researchPapers"] });
      toast.success(response.message || "Research paper uploaded successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload research paper");
    }
  });
}

export function useUpdateResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateResearchPaperApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["researchPapers"] });
      toast.success(response.message || "Research paper updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update research paper");
    }
  });
}

export function useDeleteResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResearchPaperApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["researchPapers"] });
      toast.success(response.message || "Research paper deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete research paper");
    }
  });
}

export function useApproveResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveResearchPaperApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["researchPapers"] });
      toast.success(response.message || "Research paper approved successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to approve research paper");
    }
  });
}

export function useRejectResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectResearchPaperApi,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["researchPapers"] });
      toast.success(response.message || "Research paper rejected successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reject research paper");
    }
  });
}

import { useState } from "react";
import { usePendingResearchPapers, useApproveResearchPaper } from "../Hooks/useResearchPaper";
import { DataTable } from "../../../components/common/DataTable";
import { DeptBadge } from "../../../components/common/Badge";
import { ResearchPaperDetailsModal } from "./ResearchPaperDetailsModal";
import { EditResearchPaperModal } from "./EditResearchPaperModal";
import { DeleteResearchPaperModal } from "./DeleteResearchPaperModal";
import { RejectResearchPaperModal } from "./RejectResearchPaperModal";
import { Eye, CheckCircle2, XCircle, Trash2, Loader2 } from "lucide-react";

const LIMIT = 10;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export const PendingApprovalsTab = () => {
  const [page, setPage] = useState(1);
  const [viewingPaper, setViewingPaper] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
  const [deletingPaper, setDeletingPaper] = useState(null);
  const [rejectingPaper, setRejectingPaper] = useState(null);

  const { data, isLoading, isError } = usePendingResearchPapers({ page, limit: LIMIT });
  const approvePaperMutation = useApproveResearchPaper();

  const papers = data?.papers || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    limit: LIMIT,
    totalPapers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  const columns = [
    {
      key: "title",
      header: "Title",
      accessor: (row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 leading-snug">{row.title}</div>
          {row.submittedBy?.name && (
            <div className="text-[10px] text-slate-500 mt-0.5">
              Submitted by {row.submittedBy.name}
              {row.submittedBy.regNo ? ` (${row.submittedBy.regNo})` : ""}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "authors",
      header: "Author(s)",
      accessor: (row) => (
        <div className="max-w-[200px]">
          {(row.authors || []).map((a, idx) => (
            <div key={idx} className="text-slate-800 leading-snug">
              {a.name}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => <DeptBadge dept={row.category} />,
    },
    {
      key: "createdAt",
      header: "Submitted",
      sortable: true,
      sortValue: (row) => (row.createdAt ? new Date(row.createdAt).getTime() : 0),
      accessor: (row) => <span className="font-mono text-slate-700">{formatDate(row.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setViewingPaper(row)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <button
            onClick={() => setRejectingPaper(row)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold rounded transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
          <button
            onClick={() => approvePaperMutation.mutate(row._id)}
            disabled={approvePaperMutation.isPending}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => setDeletingPaper(row)}
            className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 text-[11px] font-semibold rounded transition-colors cursor-pointer"
            title="Delete submission"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>Loading pending submissions...</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          Failed to load pending research papers. Please try refreshing.
        </div>
      ) : (
        <DataTable
          data={papers}
          columns={columns}
          keyExtractor={(p) => p._id}
          pageSize={LIMIT}
          emptyMessage="No submissions awaiting review"
          emptySubtitle="Student-submitted research papers will appear here for approval."
        />
      )}

      {/* Server Pagination */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
        <span className="text-slate-600 font-mono">
          Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalPapers} total)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded font-medium cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded font-medium cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <ResearchPaperDetailsModal
        paper={viewingPaper}
        onClose={() => setViewingPaper(null)}
        onEdit={(paper) => {
          setViewingPaper(null);
          setEditingPaper(paper);
        }}
        onDelete={(paper) => {
          setViewingPaper(null);
          setDeletingPaper(paper);
        }}
        onApprove={(paper) => {
          approvePaperMutation.mutate(paper._id, { onSuccess: () => setViewingPaper(null) });
        }}
        onReject={(paper) => {
          setViewingPaper(null);
          setRejectingPaper(paper);
        }}
      />
      <EditResearchPaperModal
        isOpen={!!editingPaper}
        onClose={() => setEditingPaper(null)}
        paper={editingPaper}
      />
      <DeleteResearchPaperModal
        isOpen={!!deletingPaper}
        onClose={() => setDeletingPaper(null)}
        paper={deletingPaper}
      />
      <RejectResearchPaperModal
        isOpen={!!rejectingPaper}
        onClose={() => setRejectingPaper(null)}
        paper={rejectingPaper}
      />
    </div>
  );
};

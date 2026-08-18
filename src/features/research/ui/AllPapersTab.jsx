import { useState, useEffect } from "react";
import { useGetResearchPapers, useApproveResearchPaper } from "../Hooks/useResearchPaper";
import { DataTable } from "../../../components/common/DataTable";
import { FilterBar } from "../../../components/common/FilterBar";
import { DeptBadge } from "../../../components/common/Badge";
import { ResearchPaperStatusBadge } from "./ResearchPaperStatusBadge";
import { ResearchPaperUpload } from "./ResearchPaperUpload";
import { EditResearchPaperModal } from "./EditResearchPaperModal";
import { DeleteResearchPaperModal } from "./DeleteResearchPaperModal";
import { RejectResearchPaperModal } from "./RejectResearchPaperModal";
import { ResearchPaperDetailsModal } from "./ResearchPaperDetailsModal";
import { Eye, PlusCircle, Trash2, Loader2 } from "lucide-react";

const LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 300;

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "CSE", value: "CSE" },
  { label: "EEE", value: "EEE" },
  { label: "CE", value: "CE" },
  { label: "ME", value: "ME" },
  { label: "Physics", value: "PHYSICS" },
  { label: "Chemistry", value: "CHEMISTRY" },
  { label: "Math", value: "MATH" },
  { label: "Biology", value: "BIOLOGY" },
  { label: "General", value: "GENERAL" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export const AllPapersTab = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [viewingPaper, setViewingPaper] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
  const [deletingPaper, setDeletingPaper] = useState(null);
  const [rejectingPaper, setRejectingPaper] = useState(null);

  const approvePaperMutation = useApproveResearchPaper();

  // Debounce typed input before it drives a request — hits the real backend
  // search endpoint (GET /admin/access/research-papers/search) instead of
  // filtering in the browser.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useGetResearchPapers({
    query: searchQuery,
    category: categoryFilter,
    status: statusFilter,
    page,
    limit: LIMIT
  });

  const papers = data?.papers || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    limit: LIMIT,
    totalPapers: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  const filterGroups = [
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      onChange: (val) => {
        setStatusFilter(val);
        setPage(1);
      },
      options: STATUS_OPTIONS,
    },
    {
      key: "category",
      label: "Category",
      value: categoryFilter,
      onChange: (val) => {
        setCategoryFilter(val);
        setPage(1);
      },
      options: CATEGORY_OPTIONS,
    },
  ];

  const columns = [
    {
      key: "title",
      header: "Title & Keywords",
      accessor: (row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-900 leading-snug">{row.title}</div>
          {row.keywords && row.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {row.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono border border-slate-200"
                >
                  #{kw}
                </span>
              ))}
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
              {a.affiliation && <span className="text-[10px] text-slate-500"> — {a.affiliation}</span>}
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
      key: "status",
      header: "Status",
      accessor: (row) => <ResearchPaperStatusBadge status={row.status} />,
    },
    {
      key: "publicationDate",
      header: "Published",
      sortable: true,
      sortValue: (row) => (row.publicationDate ? new Date(row.publicationDate).getTime() : 0),
      accessor: (row) => <span className="font-mono text-slate-700">{formatDate(row.publicationDate)}</span>,
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
            <span>View Details</span>
          </button>
          <button
            onClick={() => setDeletingPaper(row)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-semibold rounded transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Upload Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showUploadForm ? "Hide Form" : "Upload Research Paper"}</span>
        </button>
      </div>

      {/* Upload Form Accordion */}
      {showUploadForm && (
        <div className="animate-in fade-in duration-200">
          <ResearchPaperUpload onSuccess={() => setShowUploadForm(false)} />
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search title, author, abstract, keyword, journal, conference, or DOI..."
        filterGroups={filterGroups}
        onResetFilters={() => {
          setSearchInput("");
          setSearchQuery("");
          setCategoryFilter("ALL");
          setStatusFilter("ALL");
          setPage(1);
        }}
        totalResultsCount={pagination.totalPapers}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>Loading research papers...</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          Failed to load research papers. Please try refreshing.
        </div>
      ) : (
        <DataTable
          data={papers}
          columns={columns}
          keyExtractor={(p) => p._id}
          pageSize={LIMIT}
          emptyMessage="No research papers found"
          emptySubtitle="Try resetting search filters or upload a new research document."
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

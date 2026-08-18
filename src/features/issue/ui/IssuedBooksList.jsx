import { useState, useMemo, useEffect } from "react";
import { useGetIssuedBooks } from "../Hooks/useIssue";
import { DataTable } from "../../../components/common/DataTable";
import { FilterBar } from "../../../components/common/FilterBar";
import { DeptBadge } from "../../../components/common/Badge";
import { ReturnBookModal } from "./ReturnBookModal";
import { RotateCcw, AlertTriangle, CheckCircle2, BookmarkPlus, Clock, Loader2 } from "lucide-react";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");
const LIMIT = 6;

export const IssuedBooksList = ({
  onNavigateToIssueForm,
  regNo,
  bookId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [offset, setOffset] = useState(0);
  const [returnRecord, setReturnRecord] = useState(null);

  // The backend's `status` filter only accepts a single exact value
  // ("borrowed" | "overdue" | "returned"). "ALL" and "ACTIVE" (the
  // borrowed+overdue bucket) don't map onto that, so only forward the
  // two exact-match options server-side and keep filtering the rest
  // client-side below. That client narrow only applies within the current
  // page though — the endpoint is now server-paginated (default limit 3
  // if offset/limit aren't sent), so ACTIVE/ALL's displayed row count can
  // be a little under the page size when returned records fall on the
  // same page. Reset back to the first page whenever a filter changes.
  const backendStatus =
    statusFilter === "overdue" || statusFilter === "returned" ? statusFilter : undefined;

  useEffect(() => {
    setOffset(0);
  }, [statusFilter, regNo, bookId]);

  const { data, isLoading, isError } = useGetIssuedBooks({
    status: backendStatus,
    regNo,
    bookId,
    offset,
    limit: LIMIT
  });

  const issuedBooks = data?.issuedBooks || [];
  const pagination = data?.pagination;

  const filteredIssuedBooks = useMemo(() => {
    return issuedBooks.filter((item) => {
      const q = searchQuery.trim().toLowerCase();

      const matchesSearch =
        q === "" ||
        (item.bookTitle || "").toLowerCase().includes(q) ||
        (item.userName || "").toLowerCase().includes(q) ||
        (item.userRegNo || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? item.status === "borrowed" || item.status === "overdue"
          : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [issuedBooks, searchQuery, statusFilter]);

  const filterGroups = [
    {
      key: "status",
      label: "Loan Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Active Loans (Borrowed)", value: "ACTIVE" },
        { label: "Overdue Only", value: "overdue" },
        { label: "Returned History", value: "returned" },
        { label: "All Records", value: "ALL" }
      ]
    }
  ];

  const columns = [
    {
      key: "bookTitle",
      header: "Book Title & Authors",
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 leading-snug">{row.bookTitle}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {(row.bookAuthors || []).join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "userName",
      header: "Student Borrower",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.userName}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
            <span>Reg: {row.userRegNo}</span>
            <DeptBadge dept={row.userDepartment} />
          </div>
        </div>
      ),
    },
    {
      key: "borrowedAt",
      header: "Issued Date",
      sortable: true,
      accessor: (row) => <span className="font-mono text-slate-700">{formatDate(row.borrowedAt)}</span>
    },
    {
      key: "dueDate",
      header: "Due Date & Status",
      sortable: true,
      accessor: (row) => {
        const isOverdue = row.status === "overdue";
        const isReturned = row.status === "returned";
        return <div>
            <div className={`font-mono font-bold ${isOverdue ? "text-red-700" : "text-slate-900"}`}>
              {formatDate(row.dueDate)}
            </div>
            <div className="mt-1">
              {isOverdue ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  OVERDUE
                </span> : isReturned ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Returned {formatDate(row.returnedAt)}
                </span> : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <Clock className="w-3 h-3 text-blue-600" />
                  Borrowed / Active
                </span>}
            </div>
          </div>;
      }
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => <div className="flex items-center gap-1.5 justify-end">
          {row.status !== "returned" && (
              <button
        onClick={() => setReturnRecord(row)}
        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
        title="Mark book as returned"
      >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Return Book</span>
              </button>
          )}
        </div>
    }
  ];
  return <div className="space-y-4">
      {
    /* Page Header */
  }
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
            Issued Books & Circulation History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sylhet Engineering College • Active loans, overdue alerts, and book return confirmation.
          </p>
        </div>

        {onNavigateToIssueForm && <button
    onClick={onNavigateToIssueForm}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors shrink-0 cursor-pointer"
  >
            <BookmarkPlus className="w-4 h-4" />
            <span>Issue New Book</span>
          </button>}
      </div>

      {
    /* Filter Bar */
  }
      <FilterBar
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    searchPlaceholder="Search by Book Title, Student Name, or Reg No..."
    filterGroups={filterGroups}
    onResetFilters={() => {
      setSearchQuery("");
      setStatusFilter("ACTIVE");
      setOffset(0);
    }}
    totalResultsCount={pagination?.total ?? filteredIssuedBooks.length}
  />

      {/* Data Table */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>Loading circulation history...</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          Failed to load circulation records. Please try refreshing.
        </div>
      ) : (
        <DataTable
          data={filteredIssuedBooks}
          columns={columns}
          keyExtractor={(item) => item._id}
          pageSize={LIMIT}
          emptyMessage="No circulation records found"
          emptySubtitle="Try selecting 'All Records' status or clearing search query."
        />
      )}

      {/* Server-side page navigation */}
      {pagination && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
          <span className="text-slate-600 font-mono">
            {pagination.total === 0 ? (
              "No circulation records"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold">
                  {pagination.offset + 1}–{Math.min(pagination.offset + pagination.count, pagination.total)}
                </span>{" "}
                of <span className="font-semibold">{pagination.total}</span> records
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
              disabled={offset === 0}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded font-medium cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((o) => o + LIMIT)}
              disabled={offset + LIMIT >= pagination.total}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 rounded font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Return Modal */}
      <ReturnBookModal
        isOpen={!!returnRecord}
        onClose={() => setReturnRecord(null)}
        issueRecord={returnRecord}
      />
    </div>;
};

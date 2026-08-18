import { useState, useMemo, useEffect } from "react";
import { useGetReservations } from "../Hooks/useReservation";
import { useIssueReservedBook } from "../../issue/Hooks/useIssue";
import { DataTable } from "../../../components/common/DataTable";
import { FilterBar } from "../../../components/common/FilterBar";
import { DeptBadge } from "../../../components/common/Badge";
import { Clock, CheckCircle2, XCircle, AlertTriangle, BookmarkPlus, Loader2 } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

const LIMIT = 6;

 const ReservationsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [statusFilter]);

  // status is a real backend filter (getAllReservation reads req.query.status
  // directly) — every option here is a literal value it accepts, so this
  // narrows server-side instead of client-side. The endpoint is now
  // server-paginated too (default limit 3 if offset/limit aren't sent).
  const { data, isLoading, isError } = useGetReservations({
    status: statusFilter === "ALL" ? undefined : statusFilter,
    offset,
    limit: LIMIT
  });
  const reservations = data?.reservations || [];
  const pagination = data?.pagination;
  const issueReservedMutation = useIssueReservedBook();

  // Free-text search has no backend equivalent (getAllReservation has no `q`
  // param), so it stays a client-side narrow over whatever the status filter
  // already fetched.
  const filteredReservations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reservations;
    return reservations.filter((res) => {
      const bookTitle = res.book_title || res.book?.title || "";
      const studentName = res.user_name || res.user?.name || "";
      const studentRegNo = res.user_regNo || res.user?.regNo || "";
      return (
        bookTitle.toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q) ||
        studentRegNo.toLowerCase().includes(q)
      );
    });
  }, [reservations, searchQuery]);

  const filterGroups = [
    {
      key: "status",
      label: "Reservation Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Pending", value: "pending" },
        { label: "Issued", value: "issued" },
        { label: "Expired", value: "expired" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  ];

  const columns = [
    {
      key: "book_title",
      header: "Book Title & Authors",
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 leading-snug">
            {row.book_title || row.book?.title}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {(row.book_authors || row.book?.authors || []).join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "user_name",
      header: "Reserved By (Student)",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900">
            {row.user_name || row.user?.name}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
            <span>Reg: {row.user_regNo || row.user?.regNo}</span>
            <DeptBadge dept={row.user_department || row.user?.department} />
          </div>
        </div>
      ),
    },
    {
      key: "reservedAt",
      header: "Reserved At",
      sortable: true,
      accessor: (row) => <span className="font-mono text-slate-700">{formatDate(row.reservedAt)}</span>,
    },
    {
      key: "expiresAt",
      header: "Expires At & Flag",
      sortable: true,
      accessor: (row) => {
        const isExpired = row.status === "expired";
        const isCancelled = row.status === "cancelled";
        const isIssued = row.status === "issued";
        return (
          <div>
            <div className={`font-mono font-bold ${isExpired ? "text-red-700" : "text-slate-900"}`}>
              {formatDate(row.expiresAt)}
            </div>
            <div className="mt-1">
              {isIssued ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Issued
                </span>
              ) : isExpired ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                  <XCircle className="w-3 h-3 text-red-600" />
                  Expired
                </span>
              ) : isCancelled ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                  <XCircle className="w-3 h-3 text-slate-400" />
                  Cancelled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Pending
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => {
        const reservationId = row._id;
        const bookId = row.book?._id || row.book;
        return (
          <div className="flex items-center gap-1.5 justify-end">
            {row.status === "pending" && (
              <button
                onClick={() => issueReservedMutation.mutate({ bookId, reservationId })}
                disabled={issueReservedMutation.isPending}
                className="px-2.5 py-1 bg-[#1E3A8A] hover:bg-blue-900 text-white text-[11px] font-semibold rounded shadow-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Convert reservation to issued book"
              >
                <BookmarkPlus className="w-3 h-3" />
                <span>Issue</span>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          Book Reservations Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sylhet Engineering College • Hold requests, expiry tracking, convert reservation to issued loan.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by Book Title, Student Reg No, or Name..."
        filterGroups={filterGroups}
        onResetFilters={() => {
          setSearchQuery("");
          setStatusFilter("ALL");
          setOffset(0);
        }}
        totalResultsCount={pagination?.total ?? filteredReservations.length}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>Loading reservations...</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          Failed to load reservations. Please try refreshing.
        </div>
      ) : (
        <DataTable
          data={filteredReservations}
          columns={columns}
          keyExtractor={(r) => r._id}
          pageSize={LIMIT}
          emptyMessage="No reservations match your criteria"
          emptySubtitle="Try selecting 'All Statuses' or clearing search query."
        />
      )}

      {/* Server-side page navigation */}
      {pagination && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
          <span className="text-slate-600 font-mono">
            {pagination.total === 0 ? (
              "No reservations"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold">
                  {pagination.offset + 1}–{Math.min(pagination.offset + pagination.count, pagination.total)}
                </span>{" "}
                of <span className="font-semibold">{pagination.total}</span> reservations
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
    </div>
  );
};
export default ReservationsList
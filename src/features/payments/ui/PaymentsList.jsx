import { useState, useEffect } from "react";
import { useGetPayments } from "../Hooks/usePayment";
import { DataTable } from "../../../components/common/DataTable";
import { FilterBar } from "../../../components/common/FilterBar";
import { Badge } from "../../../components/common/Badge";
import { Loader2 } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusVariant = {
  VALID: "success",
  PENDING: "warning",
  FAILED: "danger",
  CANCELLED: "neutral",
};

const LIMIT = 10;

const PaymentsList = () => {
  const [regNoQuery, setRegNoQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [regNoQuery, statusFilter]);

  const { data, isLoading, isError } = useGetPayments({
    regNo: regNoQuery.trim() || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    offset,
    limit: LIMIT,
  });
  const payments = data?.payments || [];
  const pagination = data?.pagination;

  const filterGroups = [
    {
      key: "status",
      label: "Payment Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "All Statuses", value: "ALL" },
        { label: "Valid", value: "VALID" },
        { label: "Pending", value: "PENDING" },
        { label: "Failed", value: "FAILED" },
        { label: "Cancelled", value: "CANCELLED" },
      ],
    },
  ];

  const columns = [
    {
      key: "tran_id",
      header: "Transaction ID",
      accessor: (row) => <span className="font-mono text-slate-700">{row.tran_id}</span>,
    },
    {
      key: "userName",
      header: "Student",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.userName}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Reg: {row.userRegNo}</div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      accessor: (row) => <span className="font-bold text-slate-900">৳{row.amount}</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      accessor: (row) => <span className="font-mono text-slate-700">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          Fine Payments (SSLCommerz)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sylhet Engineering College • Read-only record of all fine payments — fines are cleared
          exclusively through SSLCommerz, there is no manual clearing action.
        </p>
      </div>

      <FilterBar
        searchQuery={regNoQuery}
        onSearchChange={setRegNoQuery}
        searchPlaceholder="Search by Student Reg No..."
        filterGroups={filterGroups}
        onResetFilters={() => {
          setRegNoQuery("");
          setStatusFilter("ALL");
          setOffset(0);
        }}
        totalResultsCount={pagination?.total ?? payments.length}
      />

      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>Loading payments...</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          Failed to load payments. Please try refreshing.
        </div>
      ) : (
        <DataTable
          data={payments}
          columns={columns}
          keyExtractor={(r) => r._id}
          pageSize={LIMIT}
          emptyMessage="No payments match your criteria"
          emptySubtitle="Try selecting 'All Statuses' or clearing the search query."
        />
      )}

      {pagination && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
          <span className="text-slate-600 font-mono">
            {pagination.total === 0 ? (
              "No payments"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold">
                  {pagination.offset + 1}–{Math.min(pagination.offset + payments.length, pagination.total)}
                </span>{" "}
                of <span className="font-semibold">{pagination.total}</span> payments
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

export default PaymentsList;

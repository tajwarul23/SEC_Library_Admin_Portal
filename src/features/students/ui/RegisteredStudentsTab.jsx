import { useState, useEffect } from "react";
import { useGetRegisteredStudents, useSearchRegisteredStudents } from "../Hooks/useRegisteredStudent.js";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { FilterBar } from "../../../components/common/FilterBar.jsx";
import { DeptBadge } from "../../../components/common/Badge.jsx";
import { RegisteredStudentDetailsModal } from "./RegisteredStudentDetailsModal.jsx";
import { Mail, Loader2, MousePointerClick } from "lucide-react";

const LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 300;

// Reads User documents where role === "user" (GET /api/admin/access/students)
// — students who have actually registered on the library portal. This is a
// different collection from StudentAuthentication (see AllStudentsTab).
// The backend supports real server-side department/Session filtering here,
// and (unlike AllStudentsTab) a real server-side PAGINATED text search
// (GET /api/admin/access/students/search) — but that search endpoint does
// NOT support department/Session, so those two filters are browse-mode only
// and are hidden while a search is active.
export const RegisteredStudentsTab = () => {
  const [page, setPage] = useState(1);
  const [department, setDepartment] = useState("All");
  const [session, setSession] = useState("All");
  const [selectedRegNo, setSelectedRegNo] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce typed input before it drives a request — search hits the real
  // backend endpoint instead of filtering in the browser.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const isSearching = searchQuery.length > 0;

  const { data, isLoading: isListLoading, isError: isListError, error: listError } = useGetRegisteredStudents({
    page,
    limit: LIMIT,
    department,
    Session: session
  });

  const { data: searchData, isLoading: isSearchLoading, isError: isSearchError, error: searchError } = useSearchRegisteredStudents({
    query: searchQuery,
    page,
    limit: LIMIT
  });

  const activeData = isSearching ? searchData : data;
  const students = activeData?.students || [];
  const pagination = activeData?.pagination || { page: 1, limit: LIMIT, totalStudents: 0, pageCount: 1, hasNextPage: false, hasPreviousPage: false };
  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isError = isSearching ? isSearchError : isListError;
  const error = isSearching ? searchError : listError;

  const filterGroups = [
    {
      key: "dept",
      label: "Department",
      value: department,
      onChange: (val) => {
        setDepartment(val);
        setPage(1);
      },
      options: [
        { label: "All Departments", value: "All" },
        { label: "CSE", value: "CSE" },
        { label: "EEE", value: "EEE" },
        { label: "CE", value: "CE" }
      ]
    },
    {
      key: "session",
      label: "Session",
      value: session,
      onChange: (val) => {
        setSession(val);
        setPage(1);
      },
      options: [
        { label: "All Sessions", value: "All" },
        { label: "2020-21", value: "2020-21" },
        { label: "2021-22", value: "2021-22" },
        { label: "2022-23", value: "2022-23" },
        { label: "2023-24", value: "2023-24" }
      ]
    }
  ];

  const columns = [
    {
      key: "regNo",
      header: "Reg No",
      accessor: (row) => <span className="font-mono font-bold text-slate-900">{row.regNo}</span>
    },
    {
      key: "name",
      header: "Student Name",
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-slate-400" />
            {row.email}
          </div>
        </div>
      )
    },
    {
      key: "department",
      header: "Department",
      accessor: (row) => <DeptBadge dept={row.department} />
    },
    {
      key: "Session",
      header: "Session",
      accessor: (row) => (
        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
          {row.Session}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Section header */}
      <p className="text-xs text-slate-500">
        Registered library-portal accounts — students who have logged in and completed registration.
      </p>

      {/* Click-row hint — the table has no per-row action buttons, so this
          is the only visual cue that rows are clickable. */}
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
        <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
        <span>Click on any student row to view their full profile and library activity.</span>
      </div>

      {/* Filter Bar — search hits the paginated search endpoint; the
          department/Session dropdowns are hidden while searching since that
          endpoint doesn't support them (browse-mode only). */}
      <FilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search by Reg No, Name, or Email..."
        filterGroups={isSearching ? [] : filterGroups}
        onResetFilters={() => {
          setSearchInput("");
          setSearchQuery("");
          setDepartment("All");
          setSession("All");
          setPage(1);
        }}
        totalResultsCount={pagination.totalStudents}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-slate-700" />
          <p className="text-xs font-medium">{isSearching ? "Searching registered students..." : "Fetching registered students..."}</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-xs">
          <p className="font-bold">{isSearching ? "Search failed" : "Error loading registered students"}</p>
          <p className="mt-1">{error?.message}</p>
        </div>
      ) : (
        <DataTable
          data={students}
          columns={columns}
          keyExtractor={(s) => s._id}
          pageSize={LIMIT}
          onRowClick={(row) => setSelectedRegNo(row.regNo)}
          rowHoverClassName="hover:bg-slate-100"
          emptyMessage={isSearching ? `No registered students match "${searchQuery}"` : "No registered students match your filters"}
          emptySubtitle={isSearching ? "Try a different name, reg no, or email." : "Try clearing the active department/session filters."}
        />
      )}

      {/* Server Pagination — works in both browse and search mode, since the
          search endpoint is server-paginated too. */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
        <span className="text-slate-600 font-mono">
          Page <strong>{pagination.page}</strong> of <strong>{pagination.pageCount}</strong> ({pagination.totalStudents} total)
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

      {/* Details Modal — closing just clears selectedRegNo, leaving page/
          department/session state untouched. */}
      <RegisteredStudentDetailsModal regNo={selectedRegNo} onClose={() => setSelectedRegNo(null)} />
    </div>
  );
};

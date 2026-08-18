import React, { useState, useEffect } from "react";
import { useGetStudents, useSearchStudents } from "../Hooks/useStudent.js";
import { DataTable } from "../../../components/common/DataTable.jsx";
import { FilterBar } from "../../../components/common/FilterBar.jsx";
import { DeptBadge } from "../../../components/common/Badge.jsx";
import { AddStudentModal } from "./AddStudentModal.jsx";
import { DeleteStudentModal } from "./DeleteStudentModal.jsx";
import { UserPlus, Trash2, Mail, Loader2 } from "lucide-react";

const LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 300;

// Reads the StudentAuthentication roster (getStudentsApi -> GET /api/main/student/all),
// not User — this is the admin-managed authentication list, separate from
// registered library-portal accounts (see RegisteredStudentsTab).
// /main/student/all supports real server-side department/Session filtering
// (and real pagination) now, so those two filters are browse-mode only —
// /main/student/search still has no department/Session support, so the
// filter dropdowns are hidden while a search is active (same convention as
// RegisteredStudentsTab).
export const AllStudentsTab = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [session, setSession] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Debounce typed input before it drives a request — search hits the real
  // backend endpoint (POST /main/student/search) instead of filtering
  // in the browser, so it shouldn't refire on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const isSearching = searchQuery.length > 0;

  const { data, isLoading: isListLoading, isError: isListError, error: listError } = useGetStudents({
    page,
    limit: LIMIT,
    department,
    Session: session
  });
  const { data: searchResults, isLoading: isSearchLoading, isError: isSearchError, error: searchError } = useSearchStudents(searchQuery);

  const students = isSearching ? searchResults || [] : data?.students || [];
  const pagination = data?.pagination || { page: 1, limit: LIMIT, totalStudents: 0, pageCount: 1, hasNextPage: false, hasPreviousPage: false };
  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isError = isSearching ? isSearchError : isListError;
  const error = isSearching ? searchError : listError;

  // Department/Session are now real server-side filters in browse mode, so
  // hide them while searching (the search endpoint doesn't support them).
  const filterGroups = isSearching
    ? []
    : [
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
            {row.gmail}
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
    },
    {
      key: "gender",
      header: "Gender",
      accessor: (row) => <span className="text-slate-600">{row.gender}</span>
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => setDeletingStudent(row)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            title="Delete student record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Student authentication roster — students eligible to register on the portal.
        </p>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search by Reg No, Name, or Gmail..."
        filterGroups={filterGroups}
        onResetFilters={() => {
          setSearchInput("");
          setSearchQuery("");
          setDepartment("All");
          setSession("All");
          setPage(1);
        }}
        totalResultsCount={isSearching ? students.length : pagination.totalStudents}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-slate-700" />
          <p className="text-xs font-medium">{isSearching ? "Searching student roster..." : "Fetching students list from API service..."}</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-xs">
          <p className="font-bold">{isSearching ? "Search failed" : "Error loading students"}</p>
          <p className="mt-1">{error?.message}</p>
        </div>
      ) : (
        <DataTable
          data={students}
          columns={columns}
          keyExtractor={(s) => s._id}
          pageSize={LIMIT}
          emptyMessage={isSearching ? `No students match "${searchQuery}"` : "No students match your query"}
          emptySubtitle={isSearching ? "Try a different name, reg no, or gmail." : "Try clearing search or active department/session filters."}
        />
      )}

      {/* Server Pagination — only meaningful in browse mode; the search
          endpoint returns its full match set in one response, unpaginated. */}
      {!isSearching && (
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
      )}

      {/* Modals */}
      <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <DeleteStudentModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        student={deletingStudent}
      />
    </div>
  );
};

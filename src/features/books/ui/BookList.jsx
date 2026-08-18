import { useState, useEffect } from "react";
import { useGetBooks, useSearchBooks } from "../Hooks/useBook";
import { DataTable } from "../../../components/common/DataTable";
import { FilterBar } from "../../../components/common/FilterBar";
import { DeptBadge } from "../../../components/common/Badge";
import { AddBookModal } from "./AddBookModal";
import { EditBookModal } from "./EditBookModal";
import { DeleteBookModal } from "./DeleteBookModal";
import { BookPlus, Edit, Trash2, BookmarkPlus, Loader2 } from "lucide-react";
import { BookCover } from "./BookCover";

const LIMIT = 10; 
const SEARCH_DEBOUNCE_MS = 300;

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "ALL" },
  { label: "CSE", value: "CSE" },
  { label: "EEE", value: "EEE" },
  { label: "CE", value: "CE" },
  { label: "Physics", value: "PHYSICS" },
  { label: "Chemistry", value: "CHEMISTRY" },
  { label: "General", value: "GENERAL" },
  { label: "Math", value: "MATH" },
  { label: "Arts", value: "ARTS" },
  { label: "History", value: "HISTORY" },
  { label: "Others", value: "OTHERS" },
];

const AVAILABILITY_OPTIONS = [
  { label: "All Availability", value: "ALL" },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

export const BookList = ({ onQuickIssueBook }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [offset, setOffset] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Debounce typed input before it drives a request — search hits the real
  // backend endpoint (GET /admin/access/books/search) instead of filtering
  // in the browser, so it shouldn't refire on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setOffset(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const isSearching = searchQuery.length > 0;

  const {
    data: pageData,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetBooks({ offset, limit: LIMIT, category: categoryFilter, availability: availabilityFilter });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchBooks({ query: searchQuery, offset, limit: LIMIT });

  const activeData = isSearching ? searchData : pageData;
  const books = activeData?.books || [];
  const pagination = activeData?.pagination;
  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isError = isSearching ? isSearchError : isListError;

  // The search endpoint (buildBookSearchFilter) doesn't accept
  // category/availability alongside the query, so those two filters only
  // apply in browse mode — where they're now real server-side filters,
  // not a client-side narrow of the current page.
  const filterGroups = isSearching
    ? []
    : [
        {
          key: "category",
          label: "Category",
          value: categoryFilter,
          onChange: (val) => {
            setCategoryFilter(val);
            setOffset(0);
          },
          options: CATEGORY_OPTIONS,
        },
        {
          key: "availability",
          label: "Availability",
          value: availabilityFilter,
          onChange: (val) => {
            setAvailabilityFilter(val);
            setOffset(0);
          },
          options: AVAILABILITY_OPTIONS,
        },
      ];

  const columns = [
    {
      key: "coverImage",
      header: "Cover",
      accessor: (row) => <BookCover url={row.coverImage?.url} title={row.title} />,
    },
    {
      key: "title",
      header: "Book Name & Author",

      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 leading-snug">{row.title}</div>
          <div className="text-xs text-slate-600 mt-0.5 font-medium">{(row.authors || []).join(", ")}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ISBN: {row.isbn}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",

      accessor: (row) => <DeptBadge dept={row.category} />,
    },
    {
      key: "availableCopies",
      header: "Available Copies",

      accessor: (row) => (
        <div>
          <div className="flex items-center gap-1.5 font-mono">
            <span
              className={`text-sm font-bold ${
                row.availableCopies > 0 ? "text-slate-900" : "text-red-600"
              }`}
            >
              {row.availableCopies}
            </span>
            <span className="text-slate-400 text-xs">/ {row.totalCopies} copies</span>
          </div>
          <span
            className={`inline-block text-[10px] font-semibold uppercase ${
              row.availableCopies > 0 ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {row.availableCopies > 0 ? "● In Stock" : "✕ Unavailable"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          {onQuickIssueBook && (
            <button
              onClick={() => onQuickIssueBook(row)}
              disabled={row.availableCopies <= 0}
              className="px-2 py-1 bg-[#1E3A8A] hover:bg-blue-900 text-white text-[11px] font-semibold rounded shadow-xs flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Issue this book to a student"
            >
              <BookmarkPlus className="w-3 h-3" />
              <span>Issue</span>
            </button>
          )}

          <button
            onClick={() => setEditingBook(row)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="Edit book details"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDeletingBook(row)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
            title="Delete book"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
            Book Inventory & Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sylhet Engineering College • Search by title, author, ISBN, category, manage copies, and update covers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <BookPlus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search by Book Name, Author, ISBN, or Category..."
        filterGroups={filterGroups}
        onResetFilters={() => {
          setSearchInput("");
          setSearchQuery("");
          setCategoryFilter("ALL");
          setAvailabilityFilter("ALL");
          setOffset(0);
        }}
        totalResultsCount={pagination?.total ?? books.length}
      />

      {/* Data Table */}
      {isLoading ? (
        <div className="p-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#1E3A8A]" />
          <span>{isSearching ? "Searching catalog..." : "Loading book catalog..."}</span>
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-lg border border-red-200 text-xs text-center">
          {isSearching ? "Search failed. Please try again." : "Failed to load book catalog. Please try refreshing."}
        </div>
      ) : (
        <DataTable
          data={books}
          columns={columns}
          keyExtractor={(b) => b._id}
          pageSize={LIMIT}
          emptyMessage={isSearching ? `No books match "${searchQuery}"` : "No books match your criteria"}
          emptySubtitle={
            isSearching
              ? "Try a different title, author, ISBN, or category."
              : "Try searching with a partial title or changing category filter settings."
          }
        />
      )}

      {/* Server-side page navigation — both browse and search modes are
          server-paginated now. */}
      {pagination && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs">
          <span className="text-slate-600 font-mono">
            {pagination.total === 0 ? (
  isSearching ? `No books match "${searchQuery}"` : "No books in the catalog"
) : (
  <>
    Showing{" "}
    <span className="font-semibold">
      {pagination.offset + 1}–{Math.min(
        pagination.offset + pagination.count,
        pagination.total
      )}
    </span>{" "}
    of{" "}
    <span className="font-semibold">
      {pagination.total}
    </span>{" "}
    books
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

      {/* Modals */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditBookModal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        book={editingBook}
      />

      <DeleteBookModal
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        book={deletingBook}
      />
    </div>
  );
};

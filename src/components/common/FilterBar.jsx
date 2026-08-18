import { Search, RotateCcw } from "lucide-react";
export const FilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterGroups = [],
  sortByOptions,
  sortByValue,
  onSortByChange,
  onResetFilters,
  totalResultsCount,
  showSearch = true
}) => {
  const hasActiveFilters = (showSearch && searchQuery.trim() !== "") || filterGroups.some((fg) => fg.value !== "" && fg.value !== "ALL") || sortByValue && sortByValue !== "DEFAULT";
  return <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 mb-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {
    /* Search Input */
  }
        {showSearch && <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
    type="text"
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
    placeholder={searchPlaceholder}
    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
  />
          {searchQuery && <button
    onClick={() => onSearchChange("")}
    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
  >
              Clear
            </button>}
        </div>}

        {
    /* Dynamic Filter Selects */
  }
        <div className="flex flex-wrap items-center gap-2">
          {filterGroups.map((group) => <div key={group.key} className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:inline">
                {group.label}:
              </span>
              <select
    value={group.value}
    onChange={(e) => group.onChange(e.target.value)}
    className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
  >
                {group.options.map((opt) => <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>)}
              </select>
            </div>)}

          {
    /* Sort By Dropdown */
  }
          {sortByOptions && onSortByChange && <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:inline">
                Sort:
              </span>
              <select
    value={sortByValue || "DEFAULT"}
    onChange={(e) => onSortByChange(e.target.value)}
    className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
  >
                {sortByOptions.map((opt) => <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>)}
              </select>
            </div>}

          {
    /* Reset Filters */
  }
          {hasActiveFilters && onResetFilters && <button
    onClick={onResetFilters}
    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
    title="Reset search and filters"
  >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>}
        </div>
      </div>

      {totalResultsCount !== void 0 && <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-900 font-semibold">{totalResultsCount}</strong> matching record(s)
          </span>
          {hasActiveFilters && <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] border border-amber-200">
              Filters Applied
            </span>}
        </div>}
    </div>;
};

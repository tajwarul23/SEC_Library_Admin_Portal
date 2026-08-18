import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
export function DataTable({
  data,
  columns,
  keyExtractor,
  pageSize = 6,
  emptyMessage = "No records found",
  emptySubtitle = "Try adjusting your search query or filter settings.",
  isLoading = false,
  onRowClick,
  rowHoverClassName = "hover:bg-slate-50/80"
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const handleSort = (colKey) => {
    if (sortKey === colKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(colKey);
      setSortDirection("asc");
    }
  };
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      let valA = col.sortValue ? col.sortValue(a) : a[col.key];
      let valB = col.sortValue ? col.sortValue(b) : b[col.key];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, columns, sortKey, sortDirection]);
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safeCurrentPage, pageSize]);
  const startItemNumber = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItemNumber = Math.min(safeCurrentPage * pageSize, totalItems);
  return <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-h-[220px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              {columns.map((col) => {
    const isSorted = sortKey === col.key;
    return <th
      key={col.key}
      className={`py-3 px-4 ${col.className || ""} ${col.sortable ? "cursor-pointer select-none hover:bg-slate-100 transition-colors" : ""}`}
      onClick={() => col.sortable && handleSort(col.key)}
    >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && <span className="text-slate-400">
                          {isSorted ? sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-[#0EA5E9]" /> : <ArrowDown className="w-3.5 h-3.5 text-[#0EA5E9]" /> : <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                        </span>}
                    </div>
                  </th>;
  })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? Array.from({ length: pageSize }).map((_, idx) => <tr key={idx} className="animate-pulse">
                  {columns.map((_2, cIdx) => <td key={cIdx} className="py-3 px-4">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </td>)}
                </tr>) : paginatedData.length > 0 ? paginatedData.map((row) => <tr
    key={keyExtractor(row)}
    onClick={onRowClick ? () => onRowClick(row) : undefined}
    className={`${rowHoverClassName} transition-colors bg-white ${onRowClick ? "cursor-pointer" : ""}`}
  >
                  {columns.map((col) => <td key={col.key} className={`py-3.5 px-4 text-slate-800 ${col.className || ""}`}>
                      {col.accessor ? col.accessor(row) : row[col.key]}
                    </td>)}
                </tr>) : <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{emptyMessage}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{emptySubtitle}</p>
                  </div>
                </td>
              </tr>}
          </tbody>
        </table>
      </div>

      {
    
  }
     
    </div>;
}

import { useSearchParams } from "react-router-dom";
import { AllPapersTab } from "./AllPapersTab.jsx";
import { PendingApprovalsTab } from "./PendingApprovalsTab.jsx";
import { usePendingResearchPapers } from "../Hooks/useResearchPaper.js";

const TABS = [
  { key: "all", label: "All Papers" },
  { key: "pending", label: "Pending Approvals" }
];

// Two views live under this one route:
//   - All Papers        -> AllPapersTab (search/browse every status, upload, edit, delete)
//   - Pending Approvals  -> PendingApprovalsTab (dedicated review queue for student submissions)
// Only the active tab's component is mounted, so switching tabs doesn't
// fetch both datasets at once. Active tab lives in the URL (?tab=) matching
// the convention used by the student directory page.
const ResearchPapersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "pending" ? "pending" : "all";
  const setActiveTab = (key) => setSearchParams(key === "all" ? {} : { tab: key });

  // Lightweight query just to surface a pending count badge on the tab —
  // limit: 1 keeps the payload tiny since only pagination.totalPapers is used.
  const { data: pendingData } = usePendingResearchPapers({ page: 1, limit: 1 });
  const pendingCount = pendingData?.pagination?.totalPapers || 0;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
            Research Papers Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sylhet Engineering College • Institutional research publications archive.
          </p>
        </div>

        <div className="flex items-center gap-1 mt-4 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "border-[#1E3A8A] text-[#1E3A8A]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.key === "pending" && pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "all" ? <AllPapersTab /> : <PendingApprovalsTab />}
    </div>
  );
};
export default ResearchPapersList;

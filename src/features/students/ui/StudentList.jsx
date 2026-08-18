import { useSearchParams } from "react-router-dom";
import { AllStudentsTab } from "./AllStudentsTab.jsx";
import { RegisteredStudentsTab } from "./RegisteredStudentsTab.jsx";

const TABS = [
  { key: "all", label: "All Students" },
  { key: "registered", label: "Registered Students" }
];

// Two independent datasets live under this one route:
//   - All Students    -> StudentAuthentication (AllStudentsTab)
//   - Registered Students -> User where role === "user" (RegisteredStudentsTab)
// Only the active tab's component is mounted, so only its dataset is
// fetched — switching tabs doesn't pull both at once.
// Active tab lives in the URL (?tab=) rather than local state so the
// dashboard's student stat cards can deep-link straight to either tab.
const StudentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "registered" ? "registered" : "all";
  const setActiveTab = (key) => setSearchParams(key === "all" ? {} : { tab: key });

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
          Student Management Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Sylhet Engineering College • Manage the student authentication roster and view registered library-portal accounts.
        </p>

        <div className="flex items-center gap-1 mt-4 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "border-[#1E3A8A] text-[#1E3A8A]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "all" ? <AllStudentsTab /> : <RegisteredStudentsTab />}
    </div>
  );
};
export default StudentList;

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useGetOverdueStats, useGetReservationStats } from "../../features/dashboard/Hooks/useDashboard.js";
import {
  LogOut,
  PlusCircle,
  Bell,
  Menu,
  X,
  ChevronRight,
  
  CircleUserRound
} from "lucide-react";

export const Header = ({
  onToggleSidebarMobile,
  isSidebarMobileOpen
}) => {
  const { user, logout } = useAuth();
  const { data: overdueStats } = useGetOverdueStats();
  const { data: reservationStats } = useGetReservationStats();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const overdueCount = overdueStats?.overdueCount ?? 0;
  const pendingReservationsCount = reservationStats?.activeReservations ?? 0;

  const tabTitles = {
    "/overview": "Overview & Analytics",
    "/students": "Student Directory",
    "/books": "Book Catalog & Inventory",
    "/issue": "Issue Book (Circulation)",
    "/issued-list": "Issued Books & Overdue Tracker",
    "/reservations": "Hold Requests & Reservations",
    "/research": "Institutional Research Repository"
  };

  return <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-xs sticky top-0 z-20 shrink-0">
      <div className="flex items-center gap-3">
        <button
    onClick={onToggleSidebarMobile}
    className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded focus:outline-none"
    aria-label="Toggle navigation menu"
  >
          {isSidebarMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-400 font-medium hidden sm:inline">Admin Portal</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />
          <span className="font-semibold text-slate-800 tracking-tight">
            {tabTitles[location.pathname] || "Dashboard"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
    onClick={()=>navigate("/issue")}
    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
  >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Issue Book</span>
        </button>

     

        <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

        <div className="relative">
          <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="flex items-center gap-2.5 p-1 rounded hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
  >
  <CircleUserRound/>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                Admin: {user?.name }
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {user?.role}
              </p>
            </div>
          </button>

          {showProfileMenu && <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 text-slate-800 animate-in fade-in duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-900">{user?.name || "M. Rahman"}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email || "admin@sec.ac.bd"}</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#1E3A8A]/10 text-[#1E3A8A] text-[10px] font-semibold rounded">
                  {user?.role }
                </span>
              </div>

              <button
    onClick={() => {
      setShowProfileMenu(false);
      logout();
    }}
    className="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium"
  >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Logout from Admin Portal</span>
              </button>
            </div>}
        </div>
      </div>
    </header>;
};
import { NavLink, useNavigate } from "react-router-dom";
import { useGetIssueStats, useGetReservationStats, useGetOverdueStats } from "../../features/dashboard/Hooks/useDashboard.js";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  BookmarkPlus,
  BookCheck,
  CalendarDays,
  FileText,
  LogOut,
  Building,
  Receipt,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import logo from "../../assets/logo.png";

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  // Students/books totals aren't badged here — the backend's list endpoints
  // are paginated and don't return a grand total, so an accurate count
  // would need a dedicated stats endpoint (also true for /overview and
  // /research, which have no backend routes at all yet). Issued/reservation
  // counts use the dedicated stats endpoints (not the paginated list
  // endpoints, which default to a 3-record page and would badge the wrong
  // number) — same query keys as the dashboard, so this shares its cache.
  const { data: issueStats } = useGetIssueStats();
  const { data: reservationStats } = useGetReservationStats();
  const { data: overdueStats } = useGetOverdueStats();
  const overdueCount = overdueStats?.overdueCount ?? 0;
  const activeIssuedCount = issueStats?.activeIssued ?? 0;
  const pendingReservationsCount = reservationStats?.activeReservations ?? 0;

  const navItems = [
    {
      path: "/overview",
      label: "Overview & Analytics",
      icon: LayoutDashboard,
      badge: null,
    },
    { path: "/students", label: "Student Directory", icon: Users, badge: null },
    { path: "/books", label: "Book Inventory", icon: BookOpen, badge: null },
    {
      path: "/issue",
      label: "Issue Book (Circulation)",
      icon: BookmarkPlus,
      badge: null,
    },
    {
      path: "/issued-list",
      label: "Issued Books",
      icon: BookCheck,
      badge:
        overdueCount > 0 ? `${overdueCount} overdue` : activeIssuedCount,
      badgeType: overdueCount > 0 ? "danger" : "neutral",
    },
    {
      path: "/reservations",
      label: "Book Reservations",
      icon: CalendarDays,
      badge: pendingReservationsCount > 0 ? pendingReservationsCount : null,
      badgeType: "warning",
    },
    {
      path: "/research",
      label: "Research Papers Repository",
      icon: FileText,
      badge: null,
    },
    {
      path: "/payments",
      label: "Fine Payments",
      icon: Receipt,
      badge: null,
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-[#1E293B] text-slate-300 border-r border-slate-700/50 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          <div
            onClick={() => navigate("/overview")}
            className="p-6 border-b border-slate-700/50 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={logo} alt="SEC Library" className="w-9 h-9 object-contain shrink-0" />

              <div>
                <h1 className="text-white font-bold text-base leading-tight">
                  SEC Library
                </h1>

                <span className="text-slate-400 text-[10px] font-mono font-medium uppercase tracking-wider block mt-0.5">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs transition-colors cursor-pointer text-left ${isActive ? "bg-[#0EA5E9]/10 text-[#38BDF8] border-r-4 border-[#0EA5E9] font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${isActive ? "text-[#38BDF8]" : "text-slate-400"}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== null && item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 text-[10px] font-bold rounded font-mono ${item.badgeType === "danger" ? "bg-red-500 text-white animate-pulse" : item.badgeType === "warning" ? "bg-amber-500 text-slate-950" : isActive ? "bg-[#0EA5E9] text-white" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/50 bg-[#152031] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
            <Building className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span className="text-[11px] font-medium truncate">Logout</span>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors text-xs font-medium cursor-pointer p-1 rounded hover:bg-slate-800"
            title="Logout from Student Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};

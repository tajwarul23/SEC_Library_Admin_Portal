import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetDashboardStats } from "../Hooks/useDashboard.js";
import { useGetIssuedBooks } from "../../issue/Hooks/useIssue.js";
import { useGetReservations } from "../../reservations/Hooks/useReservation.js";
import { StatCard } from "../../../components/common/StatCard.jsx";
import {
  BookOpen,
  Users,
  UserCheck,
  BookCheck,
  AlertTriangle,
  BookmarkPlus,
  Clock,
  ArrowRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { DeptBadge } from "../../../components/common/Badge.jsx";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "N/A");

export const DashboardOverview = ({
  onOpenQuickIssue,
  onOpenAddBook,
  onOpenAddStudent
}) => {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, error } = useGetDashboardStats();
  // Both list endpoints are server-paginated now (default limit 3 if
  // offset/limit aren't sent), so request enough rows to cover what's
  // actually rendered below (slice(0, 8) / slice(0, 5)).
  const { data: recentIssuedData } = useGetIssuedBooks({ status: "borrowed", limit: 8 });
  const { data: recentReservationsData } = useGetReservations({ status: "pending", limit: 5 });
  const recentIssuedBooks = recentIssuedData?.issuedBooks || [];
  const recentReservations = recentReservationsData?.reservations || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-slate-700" />
        <p className="text-sm font-medium">Loading central library analytics from API...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        <p className="font-bold">Failed to load dashboard statistics</p>
        <p className="mt-1">{error?.message || "Error communicating with library API server."}</p>
      </div>
    );
  }

  const {
    totalBookTitles,
    totalCopies,
    availableCopies,
    totalStudents,
    totalRegisteredStudents,
    activeIssued,
    activeReservations,
    overdueCount
  } = stats;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
              Library System Overview
            </h1>
            
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sylhet Engineering College • Real-time circulation analytics, inventory tracking, and student status.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQuickIssue}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Issue Book</span>
          </button>
          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded shadow-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Add Book</span>
          </button>
          <button
            onClick={onOpenAddStudent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded border border-slate-300 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid — Pending Fines card dropped: no backend support yet.
          Student count is split into two cards since totalStudents (the
          StudentAuthentication roster) and totalRegisteredStudents (User
          role === "user", students actually using the portal) come from
          different collections and answer different questions. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Titles"
          value={totalBookTitles}
          subtitle={`${availableCopies} of ${totalCopies} copies available`}
          icon={BookOpen}
          variant="blue"
          onClick={() => navigate("/books")}
        />
        <StatCard
          title="Active Library Users"
          value={totalRegisteredStudents}
          subtitle="Registered on the library platform"
          icon={UserCheck}
          badgeText="Using the system"
          badgeType="success"
          variant="green"
          onClick={() => navigate("/students?tab=registered")}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across the library database"
          icon={Users}
          variant="blue"
          onClick={() => navigate("/students?tab=all")}
        />
        <StatCard
          title="Currently Issued"
          value={activeIssued}
          subtitle="Active library loans"
          icon={BookCheck}
          badgeText="Active"
          badgeType="info"
          variant="blue"
          onClick={() => navigate("/issued-list")}
        />
        <StatCard
          title="Overdue Books"
          value={overdueCount}
          subtitle="Requires attention"
          icon={AlertTriangle}
          badgeText={overdueCount > 0 ? "Urgent" : "Clear"}
          badgeType={overdueCount > 0 ? "danger" : "success"}
          variant="red"
          onClick={() => navigate("/issued-list")}
        />
        <StatCard
          title="Reservations"
          value={activeReservations}
          subtitle="Pending pickup"
          icon={Clock}
          badgeText="Pending"
          badgeType="warning"
          variant="amber"
          onClick={() => navigate("/reservations")}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Reservations */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Clock className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-bold tracking-tight text-slate-900 font-serif">
                  Book Holds ({recentReservations.length})
                </h2>
              </div>
              <button
                onClick={() => navigate("/reservations")}
                className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentReservations.length > 0 ? (
              <div className="space-y-3">
                {recentReservations.slice(0, 5).map((item) => (
                  <div
                    key={item._id}
                    className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 line-clamp-1">
                        {item.book_title || item.book?.title}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-600 text-white font-mono text-[10px] font-bold rounded shrink-0">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 text-[11px]">
                      <span>Borrower: <strong className="text-slate-800">{item.user_name || item.user?.name}</strong></span>
                      <span className="font-mono text-slate-500">Reg: {item.user_regNo || item.user?.regNo}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[10px] text-amber-800 font-medium">
                      <span>Expires: {formatDate(item.expiresAt)}</span>
                      <DeptBadge dept={item.user_department || item.user?.department} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs bg-slate-50 rounded border border-dashed border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-800">No pending holds</p>
                <p className="text-[11px] text-slate-500 mt-0.5">All book reservations are fulfilled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Circulation Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-slate-900 font-serif">
                  Recent Circulation Activity
                </h2>
                <p className="text-xs text-slate-500">
                  Active loans currently on the shelves
                </p>
              </div>
              <button
                onClick={() => navigate("/issued-list")}
                className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Full Circulation Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Book Title</th>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Issued Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentIssuedBooks.slice(0, 8).map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900 max-w-xs truncate">
                        {item.bookTitle}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <div>{item.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Reg: {item.userRegNo}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {formatDate(item.borrowedAt)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {formatDate(item.dueDate)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            item.status === "overdue"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {recentIssuedBooks.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-xs">No active loans right now.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

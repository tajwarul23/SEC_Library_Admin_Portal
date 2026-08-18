import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const AdminLayout = () => {
  // State management
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [quickIssueBook, setQuickIssueBook] = useState(null);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <Header
          onToggleSidebarMobile={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
          isSidebarMobileOpen={isSidebarMobileOpen}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet context={{ quickIssueBook, setQuickIssueBook }} />
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Sylhet Engineering College. All rights reserved.
          </span>
          <span>Library Management System — Admin Portal</span>
        </footer>
      </div>
    </div>
  );
};

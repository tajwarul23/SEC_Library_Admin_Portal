import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/common/AdminLayout";
import ProtectedLayout from "./components/auth/ProtectedLayout";
import { LoginForm } from "./features/auth/ui/LoginForm";
import { lazy, Suspense } from "react";
import { LoadingPage } from "./components/common/LoadingPage";
// Route components

const DashboardRoute = lazy(() => import("./features/dashboard/routes/DashboardRoute"));
const StudentList = lazy(() => import("./features/students/ui/StudentList"));
const BookListRoute = lazy(() => import("./features/books/routes/BookListRoute"));
const IssueFormRoute = lazy(() => import("./features/issue/routes/IssueFormRoute"));
const IssuedBooksListRoute = lazy(() => import("./features/issue/routes/IssuedBooksListRoute"));
const ReservationsList = lazy(() => import("./features/reservations/ui/ReservationsList"));
const ResearchPapersList = lazy(() => import("./features/research/ui/ResearchPapersList"));

export default function App() {
  return (
    <Suspense fallback={<LoadingPage />}>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginForm />} />

      {/* Protected admin routes */}
      <Route element={<ProtectedLayout allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route
            index
            element={<Navigate to="/overview" replace />}
          />

          <Route
            path="/overview"
            element={<DashboardRoute />}
          />

          <Route
            path="/students"
            element={<StudentList />}
          />

          <Route
            path="/books"
            element={<BookListRoute />}
          />

          <Route
            path="/issue"
            element={<IssueFormRoute />}
          />

          <Route
            path="/issued-list"
            element={<IssuedBooksListRoute />}
          />

          <Route
            path="/reservations"
            element={<ReservationsList />}
          />

          <Route
            path="/research"
            element={<ResearchPapersList />}
          />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  );
}
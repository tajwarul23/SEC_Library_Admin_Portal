import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Loader2 } from "lucide-react";
import { LoadingPage } from "../common/LoadingPage.jsx";

const Protected = ({ children, allowedRoles }) => {
  const { user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      // <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      //   <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      // </div>
      <LoadingPage/>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Protected;

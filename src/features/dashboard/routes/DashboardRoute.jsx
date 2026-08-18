import { useNavigate, useOutletContext } from "react-router-dom";
import { DashboardOverview } from "../ui/DashboardOverview";

 const DashboardRoute = () => {
  const navigate = useNavigate();

  return (
    <DashboardOverview
      onOpenQuickIssue={() => navigate("/issue")}
      onOpenAddBook={() => navigate("/books")}
      onOpenAddStudent={() => navigate("/students")}
    />
  );
};
export default DashboardRoute;
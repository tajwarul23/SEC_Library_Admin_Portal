import Protected from "./Protected.jsx";
import { Outlet } from "react-router-dom";

const ProtectedLayout = ({ allowedRoles }) => {
  return (
    <Protected allowedRoles={allowedRoles}>
      <Outlet />
    </Protected>
  );
};

export default ProtectedLayout;

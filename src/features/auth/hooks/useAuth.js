import { useAuth as useAuthFromContext } from "../../../hooks/useAuth.jsx";
export const useAuth = () => {
  return useAuthFromContext();
};

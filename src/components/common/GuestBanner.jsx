import { Eye } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";

// Shown on every page while browsing as a guest. Action buttons are
// disabled, and the backend refuses any change from a guest session.
export const GuestBanner = () => {
  const { isGuest, logout } = useAuth();
  if (!isGuest) return null;

  return (
    <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 text-xs flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 font-medium">
        <Eye className="w-4 h-4 text-amber-700 shrink-0" />
        You're viewing as a guest: read-only. Changes are disabled.
      </span>
      <button
        type="button"
        onClick={() => logout()}
        className="shrink-0 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
      >
        Sign in as admin
      </button>
    </div>
  );
};

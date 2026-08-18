import { Loader2 } from "lucide-react";

export const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-12 px-4 text-center">
      <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
      <p className="text-xs font-medium text-slate-500">Loading…</p>
    </div>
  );
};

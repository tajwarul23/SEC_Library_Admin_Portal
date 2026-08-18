import { Inbox, Search, PlusCircle } from "lucide-react";
export const EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon = "inbox"
}) => {
  return <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 my-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-500 mb-3">
        {icon === "search" ? <Search className="w-6 h-6 text-slate-400" /> : <Inbox className="w-6 h-6 text-slate-400" />}
      </div>
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">{description}</p>
      {actionText && onAction && <button
    onClick={onAction}
    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded shadow-xs transition-colors"
  >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{actionText}</span>
        </button>}
    </div>;
};

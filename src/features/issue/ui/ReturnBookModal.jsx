import { Modal } from "../../../components/common/Modal";
import { useReturnIssuedBook } from "../Hooks/useIssue";
import { CheckCircle2, AlertTriangle, RotateCcw, Loader2 } from "lucide-react";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

// NOTE: the backend does not calculate or track fines on return at all
// (confirmed in returnIssuedBook — it only flips status/returnedAt and
// restocks the book). There is no fineAmount to show or a fine to "apply",
// unlike the old mock. This is intentionally on hold per current scope.
export const ReturnBookModal = ({
  isOpen,
  onClose,
  issueRecord,
  onConfirmReturn
}) => {
  const returnBookMutation = useReturnIssuedBook();

  if (!issueRecord) return null;

  const isOverdue = issueRecord.status === "overdue";

  const handleReturn = () => {
    returnBookMutation.mutate(issueRecord._id, {
      onSuccess: () => {
        if (onConfirmReturn) onConfirmReturn(issueRecord._id);
        onClose();
      },
    });
  };

  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Return Issued Book"
    subtitle={`Book: ${issueRecord.bookTitle}`}
    maxWidth="md"
  >
      <div className="space-y-4 text-xs">

        {
    /* Book & Borrower Summary */
  }
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
          <div className="flex justify-between font-bold text-slate-900">
            <span>{issueRecord.bookTitle}</span>
            <span className="font-mono text-[11px] text-slate-500">{(issueRecord.bookAuthors || []).join(", ")}</span>
          </div>
          <div className="text-slate-600">
            Borrower: <strong>{issueRecord.userName}</strong> (Reg No: {issueRecord.userRegNo})
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-200">
            <span>Issued: {formatDate(issueRecord.borrowedAt)}</span>
            <span>Due Date: {formatDate(issueRecord.dueDate)}</span>
          </div>
        </div>

        {
    /* Overdue Notice — informational only, no fine tracked server-side */
  }
        {isOverdue ? <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Overdue Circulation Alert</span>
            </div>
            <p>
              This book is past its due date. Fine tracking isn't implemented on the backend yet,
              so no penalty will be posted automatically — handle it manually for now if needed.
            </p>
          </div> : <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Book is being returned within the valid loan period.</span>
          </div>}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
    type="button"
    onClick={onClose}
    className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
  >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleReturn}
            disabled={returnBookMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {returnBookMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            <span>Confirm Return to Shelf</span>
          </button>
        </div>
      </div>
    </Modal>;
};

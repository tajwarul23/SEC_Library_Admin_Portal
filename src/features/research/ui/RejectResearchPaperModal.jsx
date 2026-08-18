import { useState } from "react";
import { Modal } from "../../../components/common/Modal";
import { useRejectResearchPaper } from "../Hooks/useResearchPaper";
import { XCircle, Loader2 } from "lucide-react";

export const RejectResearchPaperModal = ({ isOpen, onClose, paper }) => {
  const [reason, setReason] = useState("");
  const rejectPaperMutation = useRejectResearchPaper();

  if (!paper) return null;

  const handleReject = () => {
    rejectPaperMutation.mutate(
      { paperId: paper._id, reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          setReason("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Research Paper"
      subtitle="The submitting student will see this as a rejected submission"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{paper.title}</div>
          <div className="text-slate-600">{(paper.authors || []).map((a) => a.name).join(", ")}</div>
          {paper.submittedBy?.name && (
            <div className="text-slate-500">
              Submitted by {paper.submittedBy.name}
              {paper.submittedBy.regNo ? ` (${paper.submittedBy.regNo})` : ""}
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason (optional)</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this submission is being rejected..."
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

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
            onClick={handleReject}
            disabled={rejectPaperMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {rejectPaperMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>Confirm Reject</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

import { Modal } from "../../../components/common/Modal";
import { useDeleteResearchPaper } from "../Hooks/useResearchPaper";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export const DeleteResearchPaperModal = ({ isOpen, onClose, paper }) => {
  const deletePaperMutation = useDeleteResearchPaper();

  if (!paper) return null;

  const handleDelete = () => {
    deletePaperMutation.mutate(paper._id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Research Paper"
      subtitle="This permanently removes the record from the repository"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{paper.title}</div>
          <div className="text-slate-600">{(paper.authors || []).map((a) => a.name).join(", ")}</div>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p>
            Are you sure you want to delete <strong>"{paper.title}"</strong> from the repository? This cannot be undone.
          </p>
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
            onClick={handleDelete}
            disabled={deletePaperMutation.isPending}
            className="px-4 py-2 cursor-pointer text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {deletePaperMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

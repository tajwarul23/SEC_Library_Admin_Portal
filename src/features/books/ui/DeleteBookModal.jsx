import { Modal } from "../../../components/common/Modal";
import { useDeleteBook } from "../Hooks/useBook";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export const DeleteBookModal = ({ isOpen, onClose, book }) => {
  const deleteBookMutation = useDeleteBook();

  if (!book) return null;

  const handleDelete = () => {
    deleteBookMutation.mutate(book._id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Book"
      subtitle="This permanently removes the title from the catalog"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{book.title}</div>
          <div className="text-slate-600">{(book.authors || []).join(", ")}</div>
          <div className="text-[11px] font-mono text-slate-500">ISBN: {book.isbn}</div>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p>
            Are you sure you want to delete <strong>"{book.title}"</strong> from the catalog? This cannot be undone.
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
            disabled={deleteBookMutation.isPending}
            className="px-4 cursor-pointer py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleteBookMutation.isPending ? (
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

import { Modal } from "../../../components/common/Modal";
import { useDeleteStudent } from "../Hooks/useStudent";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

export const DeleteStudentModal = ({ isOpen, onClose, student }) => {
  const deleteStudentMutation = useDeleteStudent();

  if (!student) return null;

  const handleDelete = () => {
    deleteStudentMutation.mutate(student._id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Student Record"
      subtitle="This permanently removes the student from the authentication roster"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
          <div className="font-bold text-slate-900">{student.name}</div>
          <div className="text-slate-600">{student.gmail}</div>
          <div className="text-[11px] font-mono text-slate-500">
            Reg: {student.regNo} • {student.department} • Session {student.Session}
          </div>
        </div>

        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p>
            Are you sure you want to delete the student record for <strong>{student.name}</strong> ({student.regNo})?
            This cannot be undone.
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
            disabled={deleteStudentMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleteStudentMutation.isPending ? (
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

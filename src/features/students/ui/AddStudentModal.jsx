import { useState } from "react";
import { Modal } from "../../../components/common/Modal";
import { useCreateStudent } from "../Hooks/useStudent";
import { UserPlus, Loader2 } from "lucide-react";

// Fields here match StudentAuthentication exactly — gmail (not email),
// Session (capital S), and gender is required by the backend even though
// nothing else in the app displays it afterward.
export const AddStudentModal = ({ isOpen, onClose }) => {
  const createStudentMutation = useCreateStudent();
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [Session, setSession] = useState("2023-24");
  const [gmail, setGmail] = useState("");
  const [gender, setGender] = useState("Male");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !regNo.trim() || !gmail.trim()) return;

    createStudentMutation.mutate(
      {
        name: name.trim(),
        regNo: regNo.trim(),
        department,
        Session,
        gmail: gmail.trim(),
        gender,
      },
      {
        onSuccess: () => {
          setName("");
          setRegNo("");
          setGmail("");
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Student"
      subtitle="Sylhet Engineering College Academic Directory"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Student Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tanvir Ahmed Chowdhury"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. 2023331001"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              10-digit SEC Registration ID
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Department <span className="text-red-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="CSE">CSE - Computer Science & Engineering</option>
              <option value="EEE">
                EEE - Electrical & Electronic Engineering
              </option>
              <option value="CE">CE - Civil Engineering</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Session <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={Session}
              onChange={(e) => setSession(e.target.value)}
              placeholder="e.g. 2025-26"
              pattern="\d{4}-\d{2}"
              maxLength={7}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Hijra">Hijra</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Gmail Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            placeholder="student@gmail.com"
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
          <p className="text-[10px] text-slate-400 mt-0.5">
            This must match the Gmail account the student will log in with.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium cursor-pointer text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createStudentMutation.isPending}
            className="px-4 py-2 text-xs font-semibold cursor-pointer text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {createStudentMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            <span>Save Student Record</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

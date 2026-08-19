import { Modal } from "../../../components/common/Modal.jsx";
import { DeptBadge, Badge } from "../../../components/common/Badge.jsx";
import { useGetStudentDetails } from "../Hooks/useRegisteredStudent.js";
import { Loader2, AlertTriangle, Mail, BookOpen, Clock } from "lucide-react";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

// Fetches POST /api/admin/access/students/search { regNo } — a detailed
// lookup/history endpoint, not the Registered Students listing endpoint.
// Only queries when a regNo is selected (see useGetStudentDetails' enabled
// flag), so nothing fires until a row is actually clicked.
export const RegisteredStudentDetailsModal = ({ regNo, onClose }) => {
  const isOpen = !!regNo;
  const { data, isLoading, isError, error } = useGetStudentDetails(regNo);

  const student = data?.student;
  const issuedBooks = data?.issuedBooks || [];
  const reservations = data?.reservations || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registered Student Details"
      subtitle={regNo ? `Reg No: ${regNo}` : undefined}
      maxWidth="2xl"
    >
      {isLoading ? (
        <div className="py-10 flex flex-col items-center justify-center text-slate-500 text-xs">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-slate-700" />
          <span>Fetching student profile and library activity...</span>
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold">Failed to load student details</p>
            <p className="mt-1">{error?.message}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-xs">
          {/* Student Information */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Student Information
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-500">Name: </span>
                <span className="font-semibold text-slate-900">{student?.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Reg No: </span>
                <span className="font-mono font-semibold text-slate-900">{student?.regNo}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-slate-500">Email: </span>
                <span className="font-mono text-slate-800">{student?.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Department: </span>
                <DeptBadge dept={student?.department} />
              </div>
              <div>
                <span className="text-slate-500">Session: </span>
                <span className="font-mono text-slate-800">{student?.Session}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Outstanding Fine: </span>
                {student?.fine > 0 ? (
                  <Badge variant="danger" size="sm" className="font-mono font-bold">
                    ৳{student.fine}
                  </Badge>
                ) : (
                  <span className="font-mono text-slate-800">৳0</span>
                )}
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Activity Summary
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded text-center">
                <div className="text-xl font-bold text-blue-900">{issuedBooks.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold">Issued Books</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded text-center">
                <div className="text-xl font-bold text-amber-900">{reservations.length}</div>
                <div className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Reservations</div>
              </div>
              <div className={`p-3 rounded text-center border ${student?.fine > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                <div className={`text-xl font-bold ${student?.fine > 0 ? "text-red-900" : "text-slate-700"}`}>৳{student?.fine || 0}</div>
                <div className={`text-[10px] uppercase tracking-wider font-semibold ${student?.fine > 0 ? "text-red-700" : "text-slate-500"}`}>Outstanding Fine</div>
              </div>
            </div>
          </div>

          {/* Issued Books */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Issued Books
            </h4>
            {issuedBooks.length === 0 ? (
              <p className="text-slate-400 italic">No books currently issued.</p>
            ) : (
              <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
                {issuedBooks.map((ib) => (
                  <div key={ib._id} className="p-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{ib.bookTitle || ib.book?.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {(ib.bookAuthors || ib.book?.authors || []).join(", ")}
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
                      <div>Borrowed: {formatDate(ib.borrowedAt)}</div>
                      <div>Due: {formatDate(ib.dueDate)}</div>
                      <span
                        className={`inline-block mt-0.5 px-1.5 py-0.5 rounded uppercase font-bold ${
                          ib.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : ib.status === "returned"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {ib.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reservations */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Reservations
            </h4>
            {reservations.length === 0 ? (
              <p className="text-slate-400 italic">No reservation history.</p>
            ) : (
              <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
                {reservations.map((r) => (
                  <div key={r._id} className="p-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{r.book_title || r.book?.title}</div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {(r.book_authors || r.book?.authors || []).join(", ")}
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-slate-500 shrink-0">
                      <div>Reserved: {formatDate(r.reservedAt)}</div>
                      <div>Expires: {formatDate(r.expiresAt)}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded uppercase font-bold bg-slate-100 text-slate-600">
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

import { Modal } from "../../../components/common/Modal";
import { DeptBadge } from "../../../components/common/Badge";
import { ResearchPaperStatusBadge } from "./ResearchPaperStatusBadge";
import { ExternalLink, Edit, Trash2, User, CheckCircle2, XCircle } from "lucide-react";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");

export const ResearchPaperDetailsModal = ({ paper, onClose, onEdit, onDelete, onApprove, onReject }) => {
  const isOpen = !!paper;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Research Paper Details"
      subtitle={paper?.title}
      maxWidth="2xl"
    >
      {paper && (
        <div className="space-y-5 text-xs">
          {/* Title & Category */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{paper.title}</h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {paper.status && <ResearchPaperStatusBadge status={paper.status} />}
                <DeptBadge dept={paper.category} />
              </div>
            </div>
            {paper.keywords && paper.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {paper.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[10px] font-mono border border-slate-200"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Authors */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Author(s)
            </h4>
            <div className="border border-slate-200 rounded divide-y divide-slate-100 overflow-hidden">
              {(paper.authors || []).map((a, idx) => (
                <div key={idx} className="p-2.5">
                  <div className="font-semibold text-slate-900">{a.name}</div>
                  {(a.affiliation || a.orcid) && (
                    <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
                      {a.affiliation && <span>{a.affiliation}</span>}
                      {a.orcid && <span className="font-mono">ORCID: {a.orcid}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publication Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Publication Details
            </h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-500">Published: </span>
                <span className="font-mono font-semibold text-slate-900">{formatDate(paper.publicationDate)}</span>
              </div>
              <div>
                <span className="text-slate-500">DOI: </span>
                <span className="font-mono text-slate-800">{paper.doi || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500">Journal: </span>
                <span className="text-slate-800">{paper.journalName || "—"}</span>
              </div>
              <div>
                <span className="text-slate-500">Conference: </span>
                <span className="text-slate-800">{paper.conferenceName || "—"}</span>
              </div>
            </div>
          </div>

          {/* Submission / Review Info */}
          {(paper.submittedBy?.name || paper.rejectedBy?.reason) && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Submission
              </h4>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                {paper.submittedBy?.name && (
                  <div>
                    <span className="text-slate-500">Submitted by: </span>
                    <span className="font-semibold text-slate-900">{paper.submittedBy.name}</span>
                    {paper.submittedBy.regNo && (
                      <span className="text-slate-500 font-mono"> ({paper.submittedBy.regNo})</span>
                    )}
                    {paper.submittedBy.email && (
                      <span className="text-slate-500"> — {paper.submittedBy.email}</span>
                    )}
                  </div>
                )}
                {paper.status === "rejected" && paper.rejectedBy?.reason && (
                  <div>
                    <span className="text-slate-500">Rejection reason: </span>
                    <span className="text-red-700">{paper.rejectedBy.reason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Abstract */}
          {paper.abstract && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Abstract
              </h4>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                {paper.abstract}
              </p>
            </div>
          )}

          {/* Repository Link */}
          <div>
            <a
              href={paper.paperLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-semibold font-mono underline"
            >
              <span>View Full PDF Document</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDelete(paper)}
              className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() => onEdit(paper)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            {paper.status === "pending" && onReject && (
              <button
                type="button"
                onClick={() => onReject(paper)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded shadow-xs flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            )}
            {paper.status === "pending" && onApprove && (
              <button
                type="button"
                onClick={() => onApprove(paper)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

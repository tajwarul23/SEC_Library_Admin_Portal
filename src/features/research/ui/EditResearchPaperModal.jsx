import { useState, useEffect } from "react";
import { Modal } from "../../../components/common/Modal";
import { useUpdateResearchPaper } from "../Hooks/useResearchPaper";
import { Save, Calendar, Plus, X, Loader2 } from "lucide-react";

const CATEGORY_OPTIONS = ["CSE", "EEE", "CE", "ME", "PHYSICS", "CHEMISTRY", "MATH", "BIOLOGY", "GENERAL"];
const STATUS_OPTIONS = ["pending", "approved", "rejected"];
const emptyAuthor = () => ({ name: "", affiliation: "", orcid: "" });

// ISO datetime -> yyyy-mm-dd for the <input type="date"> value.
const toDateInputValue = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

export const EditResearchPaperModal = ({ isOpen, onClose, paper }) => {
  const updatePaperMutation = useUpdateResearchPaper();
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState([emptyAuthor()]);
  const [category, setCategory] = useState("CSE");
  const [paperLink, setPaperLink] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [journalName, setJournalName] = useState("");
  const [conferenceName, setConferenceName] = useState("");
  const [doi, setDoi] = useState("");
  const [status, setStatus] = useState("approved");

  useEffect(() => {
    if (paper) {
      setTitle(paper.title || "");
      setAuthors(
        paper.authors && paper.authors.length > 0
          ? paper.authors.map((a) => ({ name: a.name || "", affiliation: a.affiliation || "", orcid: a.orcid || "" }))
          : [emptyAuthor()]
      );
      setCategory(paper.category || "CSE");
      setPaperLink(paper.paperLink || "");
      setAbstractText(paper.abstract || "");
      setKeywords((paper.keywords || []).join(", "));
      setPublicationDate(toDateInputValue(paper.publicationDate));
      setJournalName(paper.journalName || "");
      setConferenceName(paper.conferenceName || "");
      setDoi(paper.doi || "");
      setStatus(paper.status || "approved");
    }
  }, [paper]);

  if (!paper) return null;

  const updateAuthor = (index, field, value) => {
    setAuthors((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };
  const addAuthor = () => setAuthors((prev) => [...prev, emptyAuthor()]);
  const removeAuthor = (index) => setAuthors((prev) => prev.filter((_, i) => i !== index));

  const validAuthors = authors
    .map((a) => ({ name: a.name.trim(), affiliation: a.affiliation.trim(), orcid: a.orcid.trim() }))
    .filter((a) => a.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !paperLink.trim() || validAuthors.length === 0) return;

    updatePaperMutation.mutate(
      {
        paperId: paper._id,
        data: {
          title: title.trim(),
          authors: validAuthors.map((a) => ({
            name: a.name,
            affiliation: a.affiliation || undefined,
            orcid: a.orcid || undefined
          })),
          category,
          paperLink: paperLink.trim(),
          abstract: abstractText.trim(),
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
          publicationDate: publicationDate || null,
          journalName: journalName.trim(),
          conferenceName: conferenceName.trim(),
          doi: doi.trim() || undefined,
          status
        }
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Research Paper" subtitle={paper.title} maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Paper Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-slate-700">
              Author(s) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addAuthor}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 hover:text-blue-900 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Author</span>
            </button>
          </div>
          <div className="space-y-2">
            {authors.map((author, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <input
                  type="text"
                  value={author.name}
                  onChange={(e) => updateAuthor(index, "name", e.target.value)}
                  placeholder="Author name"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  required={index === 0}
                />
                <input
                  type="text"
                  value={author.affiliation}
                  onChange={(e) => updateAuthor(index, "affiliation", e.target.value)}
                  placeholder="Affiliation (optional)"
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <input
                  type="text"
                  value={author.orcid}
                  onChange={(e) => updateAuthor(index, "orcid", e.target.value)}
                  placeholder="ORCID (optional)"
                  className="px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={() => removeAuthor(index)}
                  disabled={authors.length === 1}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer justify-self-start sm:justify-self-center"
                  title="Remove author"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Document PDF Link (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={paperLink}
              onChange={(e) => setPaperLink(e.target.value)}
              className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Publication Date</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Review Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Journal Name</label>
            <input
              type="text"
              value={journalName}
              onChange={(e) => setJournalName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Conference Name</label>
            <input
              type="text"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">DOI</label>
            <input
              type="text"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Keywords (comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Abstract</label>
          <textarea
            rows={3}
            value={abstractText}
            onChange={(e) => setAbstractText(e.target.value)}
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
            type="submit"
            disabled={updatePaperMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {updatePaperMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

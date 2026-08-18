import { useState, useEffect } from "react";
import { Modal } from "../../../components/common/Modal";
import { useUpdateBook } from "../Hooks/useBook";
import { Save, Image as ImageIcon, Loader2 } from "lucide-react";

const CATEGORIES = ["CSE", "EEE", "CE", "PHYSICS", "CHEMISTRY", "GENERAL", "MATH", "ARTS", "HISTORY", "OTHERS"];

export const EditBookModal = ({
  isOpen,
  onClose,
  book
}) => {
  const updateBookMutation = useUpdateBook();
  const [title, setTitle] = useState("");
  const [authorsInput, setAuthorsInput] = useState("");
  const [isbn, setIsbn] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [totalCopies, setTotalCopies] = useState(0);
  const [availableCopies, setAvailableCopies] = useState(0);
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthorsInput((book.authors || []).join(", "));
      setIsbn(book.isbn || "");
      setCategory(book.category || "GENERAL");
      setTotalCopies(book.totalCopies ?? 0);
      setAvailableCopies(book.availableCopies ?? 0);
      setCoverImage(book.coverImage?.url || "");
    }
  }, [book]);

  if (!book) return null;

  const authorList = authorsInput
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const copiesInvalid = Number(availableCopies) > Number(totalCopies);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || authorList.length === 0 || copiesInvalid) return;

    updateBookMutation.mutate(
      {
        bookId: book._id,
        data: {
          title: title.trim(),
          authors: authorList,
          isbn: isbn.trim(),
          category,
          totalCopies: Number(totalCopies),
          availableCopies: Number(availableCopies),
          coverImage: {
            url: coverImage.trim() || null,
            publicId: book.coverImage?.publicId ?? null,
          },
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };
  return <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Edit Book Details"
    subtitle={`Updating ISBN: ${book.isbn}`}
    maxWidth="xl"
  >
      <form onSubmit={handleSubmit} className="space-y-4">

        {
    /* Cover Preview */
  }
        <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row items-center gap-4">
          <div className="w-16 h-24 bg-slate-200 rounded border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center">
            {coverImage ? <img
    src={coverImage}
    alt={title}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <span className="font-semibold text-slate-800 block">Cover Photo Image</span>
            <p className="text-[11px] text-slate-500">
              Paste a direct image URL &mdash; file uploads aren't supported by the library server.
            </p>
            <input
    type="text"
    value={coverImage}
    onChange={(e) => setCoverImage(e.target.value)}
    placeholder="https://covers.openlibrary.org/isbn/9780262046305-L.jpg"
    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-[11px]"
  />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>
          <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
    required
  />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Author(s) <span className="text-red-500">*</span>
            </label>
            <input
    type="text"
    value={authorsInput}
    onChange={(e) => setAuthorsInput(e.target.value)}
    placeholder="Separate multiple authors with commas"
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
    required
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ISBN
            </label>
            <input
    type="text"
    value={isbn}
    onChange={(e) => setIsbn(e.target.value)}
    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded text-slate-900"
    required
  />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
  >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Copies
            </label>
            <input
    type="number"
    min="0"
    value={totalCopies}
    onChange={(e) => setTotalCopies(e.target.value)}
    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded text-slate-900"
    required
  />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Available Copies
            </label>
            <input
    type="number"
    min="0"
    max={totalCopies}
    value={availableCopies}
    onChange={(e) => setAvailableCopies(e.target.value)}
    className={`w-full px-3 py-2 text-xs font-mono bg-slate-50 border rounded text-slate-900 ${
      copiesInvalid ? "border-red-400" : "border-slate-300"
    }`}
    required
  />
            {copiesInvalid && (
              <p className="text-[10px] text-red-600 mt-0.5">Cannot exceed total copies.</p>
            )}
          </div>
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
            disabled={updateBookMutation.isPending || copiesInvalid}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {updateBookMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </Modal>;
};

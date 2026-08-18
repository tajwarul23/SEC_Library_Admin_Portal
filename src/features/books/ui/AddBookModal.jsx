import { useForm } from "react-hook-form";
import { Modal } from "../../../components/common/Modal";
import { useCreateBook } from "../Hooks/useBook";
import { BookPlus, Image as ImageIcon, Loader2 } from "lucide-react";

const CATEGORIES = [
  "CSE",
  "EEE",
  "CE",
  "PHYSICS",
  "CHEMISTRY",
  "GENERAL",
  "MATH",
  "ARTS",
  "HISTORY",
  "OTHERS",
];

export const AddBookModal = ({ isOpen, onClose }) => {
  const createBookMutation = useCreateBook();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      authorsInput: "",
      isbn: "",
      category: "GENERAL",
      totalCopies: 10,
      availableCopies: 10,
      coverImage:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
    },
  });

  const coverImage = watch("coverImage");
  const totalCopies = watch("totalCopies");
  const availableCopies = watch("availableCopies");

  const onSubmit = (formData) => {
    const authorList = formData.authorsInput
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    createBookMutation.mutate(
      {
        title: formData.title.trim(),

        authors: authorList,

        // Send normalized 13-digit ISBN to backend
        isbn: formData.isbn.replace(/\D/g, ""),

        category: formData.category,

        totalCopies: Number(formData.totalCopies),

        availableCopies: Number(formData.availableCopies),

        ...(formData.coverImage.trim()
          ? {
              coverImage: {
                url: formData.coverImage.trim(),
                publicId: null,
              },
            }
          : {}),
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Book to Inventory"
      subtitle="SEC Central Library Inventory System"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Book Cover */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-28 bg-slate-200 rounded border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center relative">
            {coverImage ? (
              <img
                src={coverImage}
                alt="Book cover preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <span className="font-semibold text-slate-800 block">
              Book Cover Image
            </span>

            <p className="text-[11px] text-slate-500">
              Paste a direct image URL for catalog display — file uploads
              aren't supported by the library server.
            </p>

            <input
              type="text"
              {...register("coverImage")}
              placeholder="e.g: https://covers.openlibrary.org/isbn/9780262046305-L.jpg"
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-[11px]"
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            {...register("title", {
              required: "Book title is required",
              validate: (value) =>
                value.trim().length > 0 || "Book title is required",
            })}
            placeholder="e.g. Introduction to Algorithms"
            className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 ${
              errors.title ? "border-red-400" : "border-slate-300"
            }`}
          />

          {errors.title && (
            <p className="text-[10px] text-red-600 mt-0.5">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Authors & ISBN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Authors */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Author(s) <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              {...register("authorsInput", {
                required: "At least one author is required",
                validate: (value) => {
                  const authors = value
                    .split(",")
                    .map((author) => author.trim())
                    .filter(Boolean);

                  return (
                    authors.length > 0 ||
                    "At least one author is required"
                  );
                },
              })}
              placeholder="e.g. Thomas H. Cormen, Charles E. Leiserson"
              className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                errors.authorsInput
                  ? "border-red-400"
                  : "border-slate-300"
              }`}
            />

            <p className="text-[10px] text-slate-400 mt-0.5">
              Separate multiple authors with commas.
            </p>

            {errors.authorsInput && (
              <p className="text-[10px] text-red-600 mt-0.5">
                {errors.authorsInput.message}
              </p>
            )}
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ISBN-13 <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={13}
              {...register("isbn", {
                required: "ISBN-13 is required",

                // Only allow digits
                onChange: (e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 13);
                },

                validate: (value) =>
                  /^\d{13}$/.test(value) ||
                  "ISBN must contain exactly 13 digits",
              })}
              placeholder="e.g.9780262033848"
              className={`w-full px-3 py-2 text-xs font-mono bg-slate-50 border rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                errors.isbn ? "border-red-400" : "border-slate-300"
              }`}
            />

            <p className="text-[10px] text-slate-400 mt-0.5">
              Enter exactly 13 digits. Example: 9780262033848
            </p>

            {errors.isbn && (
              <p className="text-[10px] text-red-600 mt-0.5">
                {errors.isbn.message}
              </p>
            )}
          </div>
        </div>

        {/* Category & Copies */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>

            <select
              {...register("category")}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Total Copies */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Total Copies <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              {...register("totalCopies", {
                required: "Total copies is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Total copies cannot be negative",
                },
              })}
              className={`w-full px-3 py-2 text-xs font-mono bg-slate-50 border rounded text-slate-900 ${
                errors.totalCopies
                  ? "border-red-400"
                  : "border-slate-300"
              }`}
            />

            {errors.totalCopies && (
              <p className="text-[10px] text-red-600 mt-0.5">
                {errors.totalCopies.message}
              </p>
            )}
          </div>

          {/* Available Copies */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Available Copies <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              min="0"
              max={totalCopies}
              {...register("availableCopies", {
                required: "Available copies is required",
                valueAsNumber: true,

                min: {
                  value: 0,
                  message: "Available copies cannot be negative",
                },

                validate: (value) =>
                  value <= Number(totalCopies) ||
                  "Cannot exceed total copies",
              })}
              className={`w-full px-3 py-2 text-xs font-mono bg-slate-50 border rounded text-slate-900 ${
                errors.availableCopies
                  ? "border-red-400"
                  : "border-slate-300"
              }`}
            />

            {errors.availableCopies && (
              <p className="text-[10px] text-red-600 mt-0.5">
                {errors.availableCopies.message}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
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
            disabled={createBookMutation.isPending}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {createBookMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <BookPlus className="w-3.5 h-3.5" />
            )}

            <span>Add Book to Catalog</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
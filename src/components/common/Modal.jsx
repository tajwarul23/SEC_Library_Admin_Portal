import { useEffect } from "react";
import { X } from "lucide-react";
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg"
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
    className="fixed inset-0"
    onClick={onClose}
    aria-hidden="true"
  />

      <div
    className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]`}
    role="dialog"
    aria-modal="true"
  >
        {
    /* Modal Header */
  }
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold tracking-tight text-white font-serif">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
          </div>
          <button
    onClick={onClose}
    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors focus:outline-none"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Modal Content */
  }
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>;
};

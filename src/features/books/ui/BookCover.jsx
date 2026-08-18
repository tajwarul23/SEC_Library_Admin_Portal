import { BookOpen } from "lucide-react";
import { useState } from "react";

export function BookCover({ url, title }) {
  const [imageError, setImageError] = useState(false);

  const showImage = url && !imageError;

  return (
    <div className="w-10 h-14 bg-slate-100 rounded border border-slate-200 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
      {showImage ? (
        <img
          src={url}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <BookOpen className="w-5 h-5 text-slate-400" />
      )}
    </div>
  );
}
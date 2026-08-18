import { useState, useEffect } from "react";
import { useSearchBooks } from "../../books/Hooks/useBook";
import { useSearchStudents } from "../../students/Hooks/useStudent";
import { useIssueBookDirect } from "../Hooks/useIssue";
import { DeptBadge } from "../../../components/common/Badge";
import {
  BookmarkPlus,
  Search,
  CheckCircle2,
  Loader2
} from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;

export const IssueBookForm = ({
  initialBook,
  onSuccess
}) => {
  const issueBookMutation = useIssueBookDirect();

  const [bookQuery, setBookQuery] = useState(initialBook ? initialBook.title : "");
  const [debouncedBookQuery, setDebouncedBookQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(initialBook || null);
  const [regNoQuery, setRegNoQuery] = useState("");
  const [debouncedRegNoQuery, setDebouncedRegNoQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [lastIssuedInfo, setLastIssuedInfo] = useState(null);

  useEffect(() => {
    if (initialBook) {
      setSelectedBook(initialBook);
      setBookQuery(initialBook.title);
    }
  }, [initialBook]);

  // Debounce typed input before it drives a request — hits the real backend
  // search endpoints (GET /admin/access/books/search, POST /main/student/search)
  // instead of filtering a locally-fetched batch, so a book/student outside
  // whatever page happened to be preloaded is still findable.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBookQuery(bookQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [bookQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedRegNoQuery(regNoQuery.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [regNoQuery]);

  const { data: bookSearchData } = useSearchBooks({ query: debouncedBookQuery, limit: 20 });
  const matchingBooks = bookSearchData?.books || [];
  const { data: matchingStudents = [] } = useSearchStudents(debouncedRegNoQuery);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedStudent) return;

    issueBookMutation.mutate(
      {
        bookId: selectedBook._id,
        regNo: selectedStudent.regNo
      },
      {
        onSuccess: (response) => {
          setLastIssuedInfo({
            bookTitle: selectedBook.title,
            studentName: selectedStudent.name,
            // backend auto-sets a 7-day due date — read it back from the response
            dueDate: response?.data?.dueDate
              ? new Date(response.data.dueDate).toLocaleDateString()
              : "7 days from today"
          });
          setIsSuccessMessage(true);
          setSelectedBook(null);
          setSelectedStudent(null);
          setBookQuery("");
          setRegNoQuery("");
          if (onSuccess) onSuccess();
        }
      }
    );
  };
  return <div className="space-y-6">
      
      {
    /* Page Header */
  }
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-serif">
            Circulation Counter • Issue Book
          </h1>
          
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Select book title or ISBN and match with registered student registration number to issue library materials.
          Loan period is fixed at 7 days from issue.
        </p>
      </div>

      {
    /* Success Callout Notice */
  }
      {isSuccessMessage && lastIssuedInfo && <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-emerald-900 flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-emerald-950">Book Circulation Confirmed</h3>
              <p className="text-xs mt-0.5">
                <strong>"{lastIssuedInfo.bookTitle}"</strong> has been checked out to{" "}
                <strong>{lastIssuedInfo.studentName}</strong>.
              </p>
              <div className="mt-2 text-xs font-mono font-semibold bg-emerald-100/70 text-emerald-900 px-2.5 py-1 rounded inline-block border border-emerald-200">
                Official Due Date: {lastIssuedInfo.dueDate}
              </div>
            </div>
          </div>
          <button
    onClick={() => setIsSuccessMessage(false)}
    className="text-xs text-emerald-700 hover:text-emerald-950 underline font-medium cursor-pointer"
  >
            Dismiss
          </button>
        </div>}

      <form onSubmit={handleIssueSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {
    /* Step 1: Select Book */
  }
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold text-slate-900 font-serif">Select Library Book</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Book Name or ISBN
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
    type="text"
    value={bookQuery}
    onChange={(e) => {
      setBookQuery(e.target.value);
      setSelectedBook(null);
    }}
    placeholder="Type book title, author, or ISBN e.g. CLRS..."
    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
  />
            </div>

            {
    /* Suggestions dropdown */
  }
            {!selectedBook && matchingBooks.length > 0 && <div className="mt-1 border border-slate-200 rounded bg-white shadow-md max-h-48 overflow-y-auto divide-y divide-slate-100">
                {matchingBooks.map((b) => <button
    key={b._id}
    type="button"
    onClick={() => {
      setSelectedBook(b);
      setBookQuery(b.title);
    }}
    className="w-full text-left p-2.5 hover:bg-slate-50 flex items-center gap-3 transition-colors cursor-pointer"
  >
                    <div className="w-8 h-10 bg-slate-200 rounded overflow-hidden shrink-0">
                      {b.coverImage?.url && <img
    src={b.coverImage.url}
    alt={b.title}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-bold text-slate-900 truncate">{b.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ISBN: {b.isbn} • {b.availableCopies} available
                      </div>
                    </div>
                  </button>)}
              </div>}
          </div>

          {
    /* Selected Book Resolved Card */
  }
          {selectedBook ? <div className="p-3 bg-slate-50 border border-slate-300 rounded flex items-start gap-3">
              <div className="w-12 h-16 bg-slate-200 rounded border border-slate-300 overflow-hidden shrink-0">
                {selectedBook.coverImage?.url && <img
    src={selectedBook.coverImage.url}
    alt={selectedBook.title}
    className="w-full h-full object-cover"
    referrerPolicy="no-referrer"
  />}
              </div>
              <div className="flex-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{selectedBook.title}</span>
                  <DeptBadge dept={selectedBook.category} />
                </div>
                <p className="text-slate-600">Author(s): {(selectedBook.authors || []).join(", ")}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                  <span>ISBN: {selectedBook.isbn}</span>
                </div>
                <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-emerald-800">
                    ● {selectedBook.availableCopies} copies in stock
                  </span>
                  <button
    type="button"
    onClick={() => {
      setSelectedBook(null);
      setBookQuery("");
    }}
    className="text-[11px] text-slate-500 hover:text-red-600 underline cursor-pointer"
  >
                    Change Book
                  </button>
                </div>
              </div>
            </div> : <div className="p-4 border border-dashed border-slate-200 rounded text-center text-xs text-slate-500">
              No book selected yet. Search by name or ISBN above.
            </div>}
        </div>

        {
    /* Step 2: Match Student */
  }
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold text-slate-900 font-serif">Match Student Borrower</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Registration No or Name
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
    type="text"
    value={regNoQuery}
    onChange={(e) => {
      setRegNoQuery(e.target.value);
      setSelectedStudent(null);
    }}
    placeholder="Type Reg No e.g. 2020331001..."
    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
  />
            </div>

            {
    /* Suggestions dropdown */
  }
            {!selectedStudent && matchingStudents.length > 0 && <div className="mt-1 border border-slate-200 rounded bg-white shadow-md max-h-48 overflow-y-auto divide-y divide-slate-100">
                {matchingStudents.map((s) => <button
    key={s._id}
    type="button"
    onClick={() => {
      setSelectedStudent(s);
      setRegNoQuery(s.regNo);
    }}
    className="w-full text-left p-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
  >
                    <div className="text-xs">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Reg: {s.regNo} • Session: {s.Session}
                      </div>
                    </div>
                    <DeptBadge dept={s.department} />
                  </button>)}
              </div>}
          </div>

          {
    /* Selected Student Resolved Card */
  }
          {selectedStudent ? <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedStudent.name}</span>
                <DeptBadge dept={selectedStudent.department} />
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-600">
                <span>Reg No: <strong>{selectedStudent.regNo}</strong></span>
                <span>Session: {selectedStudent.Session}</span>
              </div>
            </div> : <div className="p-4 border border-dashed border-slate-200 rounded text-center text-xs text-slate-500">
              No student borrower matched yet. Search by Reg No above.
            </div>}

          {
    /* Loan period is fixed server-side at 7 days — no custom selector */
  }
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
            Loan Duration: <strong>7 days (fixed)</strong> — the due date is set automatically by the library system.
          </p>

          {
    /* Confirm Issue Action Button */
  }
          <button
            type="submit"
            disabled={!selectedBook || !selectedStudent || selectedBook.availableCopies <= 0 || issueBookMutation.isPending}
            className="w-full py-2.5 px-4 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {issueBookMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <BookmarkPlus className="w-4 h-4" />
            )}
            <span>Confirm Book Circulation Issue</span>
          </button>
        </div>

      </form>
    </div>;
};

import { useNavigate, useOutletContext } from "react-router-dom";
import { BookList } from "../ui/BookList";

 const BookListRoute = () => {
  const navigate = useNavigate();
  const { setQuickIssueBook } = useOutletContext();

  return (
    <BookList
      onQuickIssueBook={(book) => {
        setQuickIssueBook(book);
        navigate("/issue");
      }}
    />
  );
};
export default BookListRoute;
import { useNavigate, useOutletContext } from "react-router-dom";
import { IssueBookForm } from "../ui/IssueBookForm";

 const IssueFormRoute = () => {
  const navigate = useNavigate();
  const { quickIssueBook, setQuickIssueBook } = useOutletContext();

  return (
    <IssueBookForm
      initialBook={quickIssueBook}
      onSuccess={() => {
        setQuickIssueBook(null);
        navigate("/issued-list");
      }}
    />
  );
};
export default IssueFormRoute
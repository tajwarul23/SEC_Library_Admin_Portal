import { useNavigate, useOutletContext } from "react-router-dom";
import { IssuedBooksList } from "../ui/IssuedBooksList";

 const IssuedBooksListRoute = () => {
  const navigate = useNavigate();
  const { setQuickIssueBook } = useOutletContext();

  return (
    <IssuedBooksList
      onNavigateToIssueForm={() => {
        setQuickIssueBook(null);
        navigate("/issue");
      }}
    />
  );
};
export default IssuedBooksListRoute
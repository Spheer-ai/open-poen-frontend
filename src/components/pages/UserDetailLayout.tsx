import { useParams, Link } from "react-router-dom";

export default function UserDetailsPage() {
  const { userId } = useParams();

  return (
    <div>
      <h2>User Details Page</h2>
      <p>User ID: {userId}</p>
      <Link to="/contacts">Back to Contacts</Link>
    </div>
  );
}

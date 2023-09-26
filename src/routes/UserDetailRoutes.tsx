import { Routes, Route } from "react-router-dom";
import UserDetailsPage from "../components/pages/UserDetailPage";

export default function UserDetailRoutes() {
  return (
    <Routes>
      <Route
        path="`/user/${userId}`"
        element={<UserDetailsPage></UserDetailsPage>}
      />
    </Routes>
  );
}

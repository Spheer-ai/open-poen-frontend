import { Routes, Route } from "react-router-dom";
import UserDetailsPage from "../components/pages/UserDetailPage";

function UserDetailRoutes() {
  return (
    <Routes>
      <Route
        path="`/user/${userId}`"
        element={<UserDetailsPage></UserDetailsPage>}
      />
    </Routes>
  );
}

export default UserDetailRoutes;

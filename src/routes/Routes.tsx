import { useState, useEffect } from "react";
import SidebarMenu from "../components/ui/sidebar-menu/SidebarMenu";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Contacts from "../components/pages/Contacts";
import Funds from "../components/pages/Funds";
import Transactions from "../components/pages/Transactions";
import Login from "../components/pages/Login";
import Sponsors from "../components/pages/Sponsors";
import InlineModalLayout from "../components/ui/layout/InlideModalLayout";
import styles from "../assets/scss/Routes.module.scss";
import UserDetailsPage from "../components/pages/UserDetailPage";
import EditUserForm from "../components/forms/EditUserForm";

export default function AppRoutes() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/funds");
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/funds");
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className={styles["app-container"]}>
      <SidebarMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className={styles["page-content"]}>
        <Routes>
          <Route
            path="/"
            element={<InlineModalLayout>{<Funds />}</InlineModalLayout>}
          />
          <Route
            path="/contacts/*"
            element={
              <InlineModalLayout>
                <Contacts />
                <Routes>
                  <Route
                    path="user/:userId"
                    element={<UserDetailsPage></UserDetailsPage>}
                  />
                </Routes>
              </InlineModalLayout>
            }
          />
          <Route
            path="/edit/user/:user_id"
            element={
              <InlineModalLayout>
                <EditUserForm onCancel={() => {}} onContinue={() => {}} />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds"
            element={<InlineModalLayout>{<Funds />}</InlineModalLayout>}
          />
          {isAuthenticated && (
            <>
              <Route
                path="/transactions"
                element={
                  <InlineModalLayout>{<Transactions />}</InlineModalLayout>
                }
              />
              <Route
                path="/sponsors"
                element={<InlineModalLayout>{<Sponsors />}</InlineModalLayout>}
              />
            </>
          )}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/contacts" />
              ) : (
                <Login onLogin={handleLogin} onClose={closeModal} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

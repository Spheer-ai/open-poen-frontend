import React from "react";
import { useState, useEffect } from "react";
import SidebarMenu from "../components/ui/layout/SidebarMenu";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Contacts from "../components/pages/Contacts";
import Funds from "../components/pages/Funds";
import Transactions from "../components/pages/Transactions";
import Login from "../components/pages/Login";
import InlineModalLayout from "../components/ui/layout/InlideModalLayout";
import styles from "../assets/scss/Routes.module.scss";
import UserDetailsPage from "../components/pages/UserDetailPage";
import FundDetail from "../components/pages/FundDetail";
import ResetPassword from "../components/pages/onboarding/ResetPassword";
import ResetPasswordLayout from "../components/pages/onboarding/ResetPasswordLayout";
import ResetPasswordRequest from "../components/pages/onboarding/ResetPasswordRequest";
import PermissionChecker from "../components/pages/PermissionChecker";
import RegulationList from "../components/lists/RegulationList";
import SponsorList from "../components/lists/SponsorsList";

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
    navigate("/contacts");
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/funds");
  };

  return (
    <div className={styles["app-container"]}>
      <SidebarMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className={styles["page-content"]}>
        <Routes>
          <Route
            path="/"
            element={
              <InlineModalLayout navigate={navigate}>
                {<Contacts />}
              </InlineModalLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ResetPasswordLayout>
                <ResetPassword />
              </ResetPasswordLayout>
            }
          />
          <Route
            path="/request-new-password"
            element={
              <ResetPasswordLayout>
                <ResetPasswordRequest />
              </ResetPasswordLayout>
            }
          />
          <Route
            path="/permission-checker"
            element={<PermissionChecker></PermissionChecker>}
          />
          <Route
            path="/contacts/*"
            element={
              <InlineModalLayout navigate={navigate}>
                <Contacts />
                <Routes>
                  <Route path="user/:userId" element={<UserDetailsPage />} />
                </Routes>
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/*"
            element={
              <InlineModalLayout navigate={navigate}>
                {<Funds />}
                <Routes>
                  <Route path="/detail" element={<FundDetail />} />
                </Routes>
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:action"
            element={
              <InlineModalLayout navigate={navigate}>
                {<Funds />}
              </InlineModalLayout>
            }
          />

          {isAuthenticated && (
            <>
              <Route
                path="/transactions/*"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<Transactions />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/transactions/bankconnections"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<Transactions />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/transactions/bankconnections/add-bank"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<Transactions />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/transactions/bankconnections/invite-user"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<Transactions />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/*"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<SponsorList />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/edit-sponsor"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<SponsorList />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/delete-sponsor"
                element={
                  <InlineModalLayout navigate={navigate}>
                    {<SponsorList />}
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/add-employee"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/add-officer"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/delete-grant/:grantId"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/edit-grant/:grantId"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />

              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/add-grant"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/sponsors/:sponsorId/regulations/:regulationId/edit-regulation"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />

              <Route
                path="/sponsors/:sponsorId/regulations/:action"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <RegulationList />
                  </InlineModalLayout>
                }
              />
            </>
          )}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/contacts" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

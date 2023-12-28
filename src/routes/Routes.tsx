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
import ResetPassword from "../components/pages/onboarding/ResetPassword";
import ResetPasswordLayout from "../components/pages/onboarding/ResetPasswordLayout";
import ResetPasswordRequest from "../components/pages/onboarding/ResetPasswordRequest";
import PermissionChecker from "../components/pages/PermissionChecker";
import RegulationList from "../components/lists/RegulationList";
import SponsorList from "../components/lists/SponsorsList";
import Activities from "../components/pages/Activities";
import RequestPasswordRequest from "../components/pages/account-recovery/RequestPasswordReset";

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
                {<Funds />}
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
            path="/account-recovery"
            element={
              <ResetPasswordLayout>
                <RequestPasswordRequest />
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
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/*"
            element={
              <InlineModalLayout navigate={navigate}>
                {<Funds />}
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:initiativeName"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />

          <Route
            path="/funds/:initiativeId/activities/:activityId/add-activity"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/edit-fund"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/delete-fund"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/edit-activity"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/delete-activity"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/add-payment"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/add-payment"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/transactieoverzicht"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/activiteiten"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/details"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/sponsors"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/media"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/gebruikers"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/:activityId/gebruikers/link-owners"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
              </InlineModalLayout>
            }
          />
          <Route
            path="/funds/:initiativeId/activities/gebruikers/link-owners"
            element={
              <InlineModalLayout navigate={navigate}>
                <Activities />
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
                path="/contacts/*"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <Contacts />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/contacts/add-user"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <Contacts />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/contacts/:userId/delete-user"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <Contacts />
                  </InlineModalLayout>
                }
              />
              <Route
                path="/contacts/:userId"
                element={
                  <InlineModalLayout navigate={navigate}>
                    <Contacts />
                  </InlineModalLayout>
                }
              />
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
                path="/transactions/bankconnections/delete-bank"
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
                path="/sponsors/:sponsorId/regulations/:regulationId/add-fund"
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
                path="/sponsors/:sponsorId/regulations/:regulationId/delete-regulation"
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
                <Navigate to="/funds" />
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

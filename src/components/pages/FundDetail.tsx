import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import { fetchFundDetails } from "../middleware/Api";
import EditFund from "../modals/EditFund";
import { useAuth } from "../../contexts/AuthContext";
import DeleteFund from "../modals/DeleteFund";
import TabbedFundNavigation from "../ui/layout/navigation/TabbedFundNavigation";
import FundsActivities from "../elements/tables/funds/FundsActivities";
import FundsTransactions from "../elements/tables/funds/FundsTransactions";
import FundsMedia from "../elements/tables/funds/FundsMedia";
import FundsDetails from "../elements/tables/funds/FundsDetails";
import FundsSponsors from "../elements/tables/funds/FundsSponsors";
import FundsUsers from "../elements/tables/funds/FundsUsers";
import LoadingDot from "../animation/LoadingDot";
import { InitiativeOwner } from "../../types/InitiativeOwners";
import { usePermissions } from "../../contexts/PermissionContext";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import Breadcrumb from "../ui/layout/BreadCrumbs";

interface FundDetailProps {
  initiativeId: string;
  authToken: string;
  onFundEdited: () => void;
}

interface FundDetails {
  id: number;
  name: string;
  description: string;
  purpose: string;
  target_audience: string;
  budget: number;
  income: number;
  expenses: number;
  onFundEdited: () => void;
  profile_picture: {
    attachment_thumbnail_url_512: string;
  };
  initiative_owners: InitiativeOwner[];
  entityPermissions: string[];
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
}

const FundDetail: React.FC<FundDetailProps> = ({ initiativeId, authToken }) => {
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const { fetchFieldPermissions } = useFieldPermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [fundDetails, setFundDetails] = useState<FundDetails | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isEditFundModalOpen, setIsEditFundModalOpen] = useState(false);
  const [isDeleteFundModalOpen, setIsDeleteFundModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [availableBudget, setAvailableBudget] = useState<number | null>(null);
  const [currentFundData, setCurrentFundData] = useState<FundDetails | null>(
    null,
  );
  const [initiativeOwners, setInitiativeOwners] = useState<InitiativeOwner[]>(
    [],
  );

  useEffect(() => {
    if (initiativeId) {
      fetchFundDetails(authToken, initiativeId)
        .then((data) => {
          setFundDetails(data);
          setCurrentFundData(data);
          setInitiativeOwners(data.initiative_owners);
        })
        .catch((error) => {
          console.error("Error fetching fund details:", error);
        });
    }
  }, [initiativeId, authToken, refreshTrigger]);

  useEffect(() => {
    if (location.pathname.includes("/funds/${initiativeId}")) {
      setActiveTab("transactieoverzicht");
    }
  }, [location.pathname]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "transactieoverzicht") {
      navigate(`/funds/${initiativeId}/transactieoverzicht`);
    }
    if (tabName === "activiteiten") {
      navigate(`/funds/${initiativeId}/activiteiten`);
    }
    if (tabName === "details") {
      navigate(`/funds/${initiativeId}/details`);
    }
    if (tabName === "sponsoren") {
      navigate(`/funds/${initiativeId}/sponsors`);
    }
    if (tabName === "media") {
      navigate(`/funds/${initiativeId}/media`);
    }
    if (tabName === "gebruikers") {
      navigate(`/funds/${initiativeId}/gebruikers`);
    }
  };

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        let userToken = authToken;

        if (user && user.token && initiativeId) {
          userToken = user.token;
          const userPermissions: string[] | undefined = await fetchPermissions(
            "Initiative",
            parseInt(initiativeId),
            userToken,
          );

          if (userPermissions && userPermissions.includes("edit")) {
            setHasEditPermission(true);
          } else {
            setHasEditPermission(false);
          }

          if (userPermissions && userPermissions.includes("delete")) {
            setHasDeletePermission(true);
          } else {
            setHasDeletePermission(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [user, initiativeId]);

  useEffect(() => {
    async function fetchFieldPermissionsOnMount() {
      try {
        if (user && user.token && initiativeId) {
          const fieldPermissions: string[] | undefined =
            await fetchFieldPermissions(
              "Initiative",
              parseInt(initiativeId),
              user.token,
            );

          if (fieldPermissions) {
            setEntityPermissions(fieldPermissions);
          }
        }
      } catch (error) {
        console.error("Failed to fetch field permissions:", error);
      }
    }

    fetchFieldPermissionsOnMount();
  }, [user, initiativeId, fetchFieldPermissions]);

  useEffect(() => {
    if (initiativeId && authToken) {
      fetchFundDetails(authToken, initiativeId)
        .then((data) => {
          setFundDetails(data);
          setCurrentFundData(data);
        })
        .catch((error) => {
          console.error("Error fetching fund details:", error);
        });
    }
  }, [initiativeId, authToken, refreshTrigger]);

  const handleToggleEditFundModal = () => {
    if (isEditFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditFundModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsEditFundModalOpen(true);
      navigate(`/funds/${initiativeId}/edit-fund`);
    }
  };

  const handleFundEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleDeleteFundModal = () => {
    if (isDeleteFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteFundModalOpen(false);
        navigate(`/funds/${initiativeId}`);
      }, 300);
    } else {
      setIsDeleteFundModalOpen(true);
      navigate(`/funds/${initiativeId}/delete-fund`);
    }
  };

  const handleFundDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (fundDetails) {
      const receivedBudget = fundDetails.income || 0;
      const spentBudget = fundDetails.expenses || 0;
      const availableBudgetValue = receivedBudget + spentBudget;
      setAvailableBudget(availableBudgetValue);
    }
  }, [fundDetails, refreshTrigger]);

  const handleRefreshTrigger = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className={styles["topContainer"]}>
        <div className={styles["breadCrumb"]}>
          <Breadcrumb
            customBreadcrumbs={[
              <Link key="funds" to={`/funds`}>
                Initiatieven
              </Link>,
              <Link key="funds" to={`/funds/${initiativeId}`}>
                {fundDetails?.name}
              </Link>,
            ]}
          />
        </div>
        <>
          <div className={styles["top-right-button-container"]}>
            {hasEditPermission && (
              <button
                className={styles["edit-button"]}
                onClick={handleToggleEditFundModal}
              >
                <img src={EditIcon} alt="Edit" className={styles["icon"]} />
                Beheer initiatief
              </button>
            )}
            {hasDeletePermission && (
              <button
                className={styles["edit-button"]}
                onClick={handleToggleDeleteFundModal}
              >
                <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
                Verwijder initiatief
              </button>
            )}
          </div>
        </>
      </div>
      <div className={styles["fund-detail-container"]}>
        {fundDetails ? (
          <>
            <div className={styles["content-container"]}>
              <div className={styles["fund-info"]}>
                <div className={styles["fund-name"]}>
                  {fundDetails.name ? (
                    <h1>{fundDetails.name}</h1>
                  ) : (
                    <p>Geen naam gevonden</p>
                  )}
                </div>
                <div className={styles["fund-description"]}>
                  {fundDetails.description ? (
                    <div>
                      <p>
                        {showFullDescription
                          ? fundDetails.description
                          : `${fundDetails.description.slice(0, 250)}${
                              fundDetails.description.length > 250 ? "..." : ""
                            }`}
                      </p>
                      {fundDetails.description.length > 250 && (
                        <button
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                          className={styles["read-more-button"]}
                        >
                          {showFullDescription ? "Lees minder" : "Lees meer"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>Geen beschrijving gevonden</p>
                  )}
                </div>
              </div>
              <div className={styles["fund-image"]}>
                {fundDetails.profile_picture ? (
                  <img
                    src={
                      fundDetails.profile_picture.attachment_thumbnail_url_512
                    }
                    alt="Fund Image"
                  />
                ) : (
                  <p>Geen afbeelding gevonden</p>
                )}
              </div>
            </div>
            <div className={styles["statistics-container"]}>
              <div
                className={styles["fund-budget"]}
                style={{ backgroundColor: "#E9EFFB" }}
              >
                {fundDetails.budget !== null ? (
                  <>
                    <p>
                      Toegekend budget: <br />
                      <span>
                        €{" "}
                        {fundDetails.budget.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </>
                ) : (
                  <p>Geen toegekend budget gevonden</p>
                )}
              </div>
              <div
                className={styles["fund-income"]}
                style={{ backgroundColor: "#E9EFFB" }}
              >
                {fundDetails.income !== null ? (
                  <>
                    <p>
                      Ontvangen budget: <br />
                      <span>
                        €{" "}
                        {fundDetails.income.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </>
                ) : (
                  <p>Geen inkomsten gevonden</p>
                )}
              </div>
              <div
                className={styles["fund-expenses"]}
                style={{ backgroundColor: "#FEE6F0" }}
              >
                {fundDetails.expenses !== null ? (
                  <>
                    <p style={{ color: "#B82466" }}>
                      Besteed:
                      <br />
                      <span style={{ color: "#B82466" }}>
                        €{" "}
                        {fundDetails.expenses.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </>
                ) : (
                  <p>Geen besteed budget gevonden</p>
                )}
              </div>
              {availableBudget !== null && (
                <div
                  className={styles["fund-available-budget"]}
                  style={{ backgroundColor: "#E7FDEA" }}
                >
                  {availableBudget !== null ? (
                    <>
                      <p style={{ color: "#008000" }}>
                        Beschikbaar budget: <br />
                        <span style={{ color: "#008000" }}>
                          €{" "}
                          {availableBudget.toLocaleString("nl-NL", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p style={{ color: "#008000" }}>
                      Available budget not found
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "200px",
              marginTop: "120px",
            }}
          >
            <div className={styles["loading-container"]}>
              <LoadingDot delay={0} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.1} />
              <LoadingDot delay={0.2} />
              <LoadingDot delay={0.2} />
            </div>
          </div>
        )}
        <EditFund
          isOpen={isEditFundModalOpen}
          onClose={handleToggleEditFundModal}
          isBlockingInteraction={isBlockingInteraction}
          onFundEdited={handleFundEdited}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
          fundData={currentFundData}
          fieldPermissions={entityPermissions}
          fields={[]}
        />
        <DeleteFund
          isOpen={isDeleteFundModalOpen}
          onClose={handleToggleDeleteFundModal}
          isBlockingInteraction={isBlockingInteraction}
          onFundDeleted={handleFundDeleted}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
        />
        <TabbedFundNavigation
          onTabChange={handleTabChange}
          initiativeId={initiativeId}
        />
        {activeTab === "transactieoverzicht" && (
          <FundsTransactions
            initiativeId={initiativeId}
            authToken={user?.token || ""}
            onRefreshTrigger={handleRefreshTrigger}
            entityPermissions={entityPermissions}
          />
        )}
        {activeTab === "activiteiten" && (
          <FundsActivities
            initiativeId={initiativeId}
            authToken={user?.token || ""}
          />
        )}
        {activeTab === "details" && (
          <FundsDetails
            name={fundDetails?.name}
            description={fundDetails?.description}
            purpose={fundDetails?.purpose}
            target_audience={fundDetails?.target_audience}
          />
        )}
        {activeTab === "sponsoren" && (
          <FundsSponsors
            grantId={fundDetails?.grant?.id}
            grantName={fundDetails?.grant?.name}
            grantReference={fundDetails?.grant?.reference}
            grantBudget={fundDetails?.grant?.budget}
            token={user?.token || ""}
          />
        )}
        {activeTab === "media" && (
          <FundsMedia
            initiativeId={initiativeId}
            authToken={user?.token || ""}
          />
        )}
        {activeTab === "gebruikers" && (
          <FundsUsers initiativeId={initiativeId} token={user?.token || ""} />
        )}
      </div>
    </>
  );
};

export default FundDetail;

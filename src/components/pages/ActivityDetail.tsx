import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivityDetails, fetchFundDetails } from "../middleware/Api";
import EditActivity from "../modals/EditActivity";
import DeleteActivity from "../modals/DeleteActivity";
import TabbedActivitiesNavigation from "../ui/layout/navigation/TabbedActivitiesNavigation";
import ActivityTransactions from "../elements/tables/activities/ActivityTransactions";
import ActivityDetails from "../elements/tables/activities/ActivityDetails";
import ActivitySponsors from "../elements/tables/activities/ActivitySponsors";
import ActivityMedia from "../elements/tables/activities/ActivityMedia";
import ActivityUsers from "../elements/tables/activities/ActivityUsers";
import LoadingDot from "../animation/LoadingDot";
import { ActivityOwner } from "../../types/ActivityOwners";
import { usePermissions } from "../../contexts/PermissionContext";
import { useFieldPermissions } from "../../contexts/FieldPermissionContext";
import Breadcrumb from "../ui/layout/BreadCrumbs";

interface ActivityDetailProps {
  initiativeId: string;
  activityId: string;
  authToken: string;
  onActivityEdited: () => void;
}

interface ActivityDetails {
  id: number;
  name: string;
  description: string;
  purpose: string;
  target_audience: string;
  budget: number;
  income: number;
  expenses: number;
  profile_picture: {
    attachment_thumbnail_url_512: string;
  };
  activity_owners: ActivityOwner[];
  entityPermissions: string[];
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
  initiative: {
    kvk_registration: string;
    location: string;
  };
}

interface FundDetails {
  grant: {
    id: number;
    name: string;
    reference: string;
    budget: number;
  };
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  initiativeId,
  activityId,
  authToken,
  onActivityEdited,
}) => {
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPermissions } = usePermissions();
  const { fetchFieldPermissions } = useFieldPermissions();
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const [activityDetails, setActivityDetails] =
    useState<ActivityDetails | null>(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] =
    useState(false);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [fundDetails, setFundDetails] = useState<FundDetails | null>(null);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const [hasCreatePaymentPermission, setHasCreatePaymentPermission] =
    useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [availableBudget, setAvailableBudget] = useState<number | null>(null);
  const [currentActivityData, setCurrentActivityData] =
    useState<ActivityDetails | null>(null);
  const activityOwners: ActivityOwner[] =
    activityDetails?.activity_owners || [];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "transactieoverzicht") {
      navigate(
        `/funds/${initiativeId}/activities/${activityId}/transactieoverzicht`,
      );
    }
    if (tabName === "activiteiten") {
      navigate(`/funds/${initiativeId}/activities/${activityId}/activiteiten`);
    }
    if (tabName === "details") {
      navigate(`/funds/${initiativeId}/activities/${activityId}/details`);
    }
    if (tabName === "sponsoren") {
      navigate(`/funds/${initiativeId}/activities/${activityId}/sponsors`);
    }
    if (tabName === "media") {
      navigate(`/funds/${initiativeId}/activities/${activityId}/media`);
    }
    if (tabName === "gebruikers") {
      navigate(`/funds/${initiativeId}/activities/${activityId}/gebruikers`);
    }
  };

  useEffect(() => {
    async function fetchUserPermissions() {
      try {
        let userToken = authToken;
        if (user && user.token && activityId) {
          userToken = user.token;
          const userPermissions: string[] | undefined = await fetchPermissions(
            "Activity",
            parseInt(activityId),
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

          if (userPermissions && userPermissions.includes("create_payment")) {
            setHasCreatePaymentPermission(true);
          } else {
            setHasCreatePaymentPermission(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
      }
    }

    fetchUserPermissions();
  }, [user, activityId]);

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
    if (activityId) {
      fetchActivityDetails(authToken, initiativeId, activityId)
        .then((data) => {
          setActivityDetails(data);
          setCurrentActivityData(data);
        })
        .catch((error) => {
          console.error("Error fetching activity details:", error);
        });
    }
  }, [activityId, initiativeId, authToken, refreshTrigger]);

  const handleToggleEditActivitydModal = () => {
    if (isEditActivityModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditActivityModalOpen(false);
        navigate(`/funds/${initiativeId}/activities/${activityId}`);
      }, 300);
    } else {
      setIsEditActivityModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/${activityId}/edit-activity`);
    }
  };

  const handleToggleDeleteActivitydModal = () => {
    if (isDeleteActivityModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteActivityModalOpen(false);
        navigate(`/funds`);
      }, 300);
    } else {
      setIsDeleteActivityModalOpen(true);
      navigate(
        `/funds/${initiativeId}/activities/${activityId}/delete-activity`,
      );
    }
  };

  const handleActivityEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
    onActivityEdited();
  };

  useEffect(() => {
    if (initiativeId && authToken) {
      fetchFundDetails(authToken, initiativeId)
        .then((data) => {
          setFundDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching fund details:", error);
        });
    }
  }, [initiativeId, authToken]);

  const handleActivityDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (activityDetails) {
      const receivedBudget = activityDetails.income || 0;
      const spentBudget = activityDetails.expenses || 0;
      const totalBudget = activityDetails.budget || 0;
      const availableBudgetValue = totalBudget + spentBudget;
      setAvailableBudget(availableBudgetValue);
    }
  }, [activityDetails, refreshTrigger]);

  const handleRefreshTrigger = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className={styles["topContainer"]}>
        <div className={styles["breadCrumb"]}>
          <Breadcrumb
            customBreadcrumbs={[
              <Link key="funds" to={`/funds/${initiativeId}/activities`}>
                Activiteiten
              </Link>,
              <Link
                key="activities"
                to={`/funds/${initiativeId}/activities/${activityId}`}
              >
                {activityDetails?.name}
              </Link>,
            ]}
          />
        </div>
        <div className={styles["top-right-button-container"]}>
          {hasEditPermission && (
            <button
              className={styles["edit-button"]}
              onClick={handleToggleEditActivitydModal}
            >
              <img src={EditIcon} alt="Edit" className={styles["icon"]} />
              <span>Beheer activiteit</span>
            </button>
          )}
          {hasDeletePermission && (
            <button
              className={styles["edit-button"]}
              onClick={handleToggleDeleteActivitydModal}
            >
              <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
              <span>Verwijder activiteit</span>
            </button>
          )}
        </div>
      </div>
      <div className={styles["fund-detail-container"]}>
        <div className={styles["content-wrapper"]}>
          {activityDetails ? (
            <>
              <div className={styles["content-container"]}>
                <div className={styles["fund-image"]}>
                  {activityDetails.profile_picture ? (
                    <img
                      src={
                        activityDetails.profile_picture
                          .attachment_thumbnail_url_512
                      }
                      alt="Fund Image"
                    />
                  ) : (
                    <p>Geen afbeelding gevonden</p>
                  )}
                </div>
                <div className={styles["fund-info"]}>
                  <div className={styles["fund-name"]}>
                    {activityDetails.name ? (
                      <h1>{activityDetails.name}</h1>
                    ) : (
                      <p>Geen naam gevonden</p>
                    )}
                  </div>
                  <div className={styles["fund-description"]}>
                    {activityDetails.description ? (
                      <div>
                        <p>
                          {showFullDescription
                            ? activityDetails.description
                            : `${activityDetails.description.slice(0, 250)}${
                                activityDetails.description.length > 250
                                  ? "..."
                                  : ""
                              }`}
                        </p>
                        {activityDetails.description.length > 250 && (
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
              </div>
              <div className={styles["statistics-container"]}>
                <div className={styles["fund-budget"]}>
                  {activityDetails.budget !== null ? (
                    <>
                      <p>
                        Toegekend budget: <br />
                      </p>
                      <span>
                        €{" "}
                        {activityDetails.budget.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </>
                  ) : (
                    <p>Budget not found</p>
                  )}
                </div>
                <div className={styles["fund-expenses"]}>
                  {activityDetails.expenses !== null ? (
                    <>
                      <p>
                        Besteed:
                        <br />
                      </p>
                      <span style={{ color: "#B82466" }}>
                        €{" "}
                        {Math.abs(activityDetails.expenses).toLocaleString(
                          "nl-NL",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </>
                  ) : (
                    <p>Expenses not found</p>
                  )}
                </div>
                {availableBudget !== null && (
                  <div className={styles["fund-available-budget"]}>
                    {availableBudget !== null ? (
                      <>
                        <p>
                          Beschikbaar budget: <br />
                        </p>
                        <span style={{ color: "#008000" }}>
                          €{" "}
                          {availableBudget.toLocaleString("nl-NL", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
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
        </div>
        <EditActivity
          isOpen={isEditActivityModalOpen}
          onClose={handleToggleEditActivitydModal}
          isBlockingInteraction={isBlockingInteraction}
          onActivityEdited={handleActivityEdited}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
          activityId={activityId}
          activityData={currentActivityData}
          fieldPermissions={entityPermissions}
          fields={[]}
        />
        <DeleteActivity
          isOpen={isDeleteActivityModalOpen}
          onClose={handleToggleDeleteActivitydModal}
          isBlockingInteraction={isBlockingInteraction}
          onActivityDeleted={handleActivityDeleted}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
          activityId={activityId}
        />

        <TabbedActivitiesNavigation
          onTabChange={handleTabChange}
          initiativeId={initiativeId}
          activityId={activityId}
        />
        {activeTab === "transactieoverzicht" && (
          <ActivityTransactions
            initiativeId={initiativeId}
            authToken={user?.token || ""}
            activityId={activityId}
            onRefreshTrigger={handleRefreshTrigger}
            entityPermissions={entityPermissions}
            activity_name={activityDetails?.name || ""}
            hasCreatePaymentPermission={hasCreatePaymentPermission}
          />
        )}
        {activeTab === "details" && (
          <ActivityDetails
            name={activityDetails?.name}
            description={activityDetails?.description}
            purpose={activityDetails?.purpose}
            target_audience={activityDetails?.target_audience}
            kvk_registration={activityDetails?.initiative.kvk_registration}
            location={activityDetails?.initiative.location}
          />
        )}
        {activeTab === "sponsoren" && (
          <ActivitySponsors
            grantId={fundDetails?.grant?.id}
            grantName={fundDetails?.grant?.name}
            grantReference={fundDetails?.grant?.reference}
            grantBudget={fundDetails?.grant?.budget}
            token={user?.token || ""}
          />
        )}
        {activeTab === "media" && (
          <ActivityMedia
            initiativeId={initiativeId}
            activityId={activityId}
            authToken={user?.token || ""}
          />
        )}
        {activeTab === "gebruikers" && (
          <ActivityUsers
            activityOwners={activityOwners}
            initiativeId={initiativeId}
            activityId={activityId}
            token={user?.token || ""}
          />
        )}
      </div>
    </>
  );
};

export default ActivityDetail;

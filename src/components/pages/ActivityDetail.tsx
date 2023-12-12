import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivityDetails } from "../middleware/Api";
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
  budget: number;
  income: number;
  expenses: number;
  profile_picture: {
    attachment_thumbnail_url_512: string;
  };
  activity_owners: ActivityOwner[];
  entityPermissions: string[];
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  initiativeId,
  activityId,
  authToken,
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
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [availableBudget, setAvailableBudget] = useState<number | null>(null);
  const [currentActivityData, setCurrentActivityData] =
    useState<ActivityDetails | null>(null);
  const activityOwners: ActivityOwner[] =
    activityDetails?.activity_owners || [];

  useEffect(() => {
    if (location.pathname.includes("/funds/${initiativeId}/activities")) {
      setActiveTab("transactieoverzicht");
    }
  }, [location.pathname]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "transactieoverzicht") {
      navigate(`/funds/${initiativeId}/activities/transactieoverzicht`);
    }
    if (tabName === "activiteiten") {
      navigate(`/funds/${initiativeId}/activities/activiteiten`);
    }
    if (tabName === "details") {
      navigate(`/funds/${initiativeId}/activities/details`);
    }
    if (tabName === "sponsoren") {
      navigate(`/funds/${initiativeId}/activities/sponsors`);
    }
    if (tabName === "media") {
      navigate(`/funds/${initiativeId}/activities/media`);
    }
    if (tabName === "gebruikers") {
      navigate(`/funds/${initiativeId}/activities/gebruikers`);
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
            console.log("User has edit permission");
            setHasEditPermission(true);
          } else {
            console.log("User does not have edit permission");
            setHasEditPermission(false);
          }

          if (userPermissions && userPermissions.includes("delete")) {
            console.log("User has delete permission");
            setHasDeletePermission(true);
          } else {
            console.log("User does not have delete permission");
            setHasDeletePermission(false);
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
    if (activityId && authToken) {
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
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsEditActivityModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/edit-activity`);
    }
  };

  const handleToggleDeleteActivitydModal = () => {
    if (isEditActivityModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteActivityModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsDeleteActivityModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/delete-activity`);
    }
  };

  const handleActivityEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleActivityDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (activityDetails) {
      const receivedBudget = activityDetails.income || 0;
      const spentBudget = activityDetails.expenses || 0;
      const availableBudgetValue = receivedBudget + spentBudget;
      setAvailableBudget(availableBudgetValue);
    }
  }, [activityDetails]);

  return (
    <div className={styles["fund-detail-container"]}>
      <div className={styles["top-right-button-container"]}>
        {hasEditPermission && (
          <button
            className={styles["edit-button"]}
            onClick={handleToggleEditActivitydModal}
          >
            <img src={EditIcon} alt="Edit" className={styles["icon"]} />
            Beheer activiteit
          </button>
        )}
        {hasDeletePermission && (
          <button
            className={styles["edit-button"]}
            onClick={handleToggleDeleteActivitydModal}
          >
            <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
            Verwijder activiteit
          </button>
        )}
      </div>
      {activityDetails ? (
        <>
          <div className={styles["content-container"]}>
            <div className={styles["fund-info"]}>
              <div className={styles["fund-name"]}>
                {activityDetails.name ? (
                  <h1>{activityDetails.name}</h1>
                ) : (
                  <p>Name not found</p>
                )}
              </div>
              <div className={styles["fund-description"]}>
                {activityDetails.description ? (
                  <div>
                    <p>
                      {showFullDescription
                        ? activityDetails.description
                        : `${activityDetails.description.slice(0, 150)}...`}
                    </p>
                    {activityDetails.description.length > 150 && (
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
                  <p>Description not found</p>
                )}
              </div>
            </div>
            <div className={styles["fund-image"]}>
              {activityDetails.profile_picture ? (
                <img
                  src={
                    activityDetails.profile_picture.attachment_thumbnail_url_512
                  }
                  alt="Fund Image"
                />
              ) : (
                <p>Image not found</p>
              )}
            </div>
          </div>
          <div className={styles["statistics-container"]}>
            <div
              className={styles["fund-budget"]}
              style={{ backgroundColor: "#E9EFFB" }}
            >
              {activityDetails.budget ? (
                <>
                  <p>
                    Toegekend budget: <br />
                    <span>€ {activityDetails.budget} </span>
                  </p>
                </>
              ) : (
                <p>Budget not found</p>
              )}
            </div>
            <div
              className={styles["fund-income"]}
              style={{ backgroundColor: "#E9EFFB" }}
            >
              {activityDetails.income ? (
                <>
                  <p>
                    Ontvangen budget: <br />
                    <span>€ {activityDetails.income}</span>
                  </p>
                </>
              ) : (
                <p>Income not found</p>
              )}
            </div>
            <div
              className={styles["fund-expenses"]}
              style={{ backgroundColor: "#FEE6F0" }}
            >
              {activityDetails.expenses ? (
                <>
                  <p style={{ color: "#B82466" }}>
                    Besteed:
                    <br />
                    <span style={{ color: "#B82466" }}>
                      € {activityDetails.expenses}
                    </span>
                  </p>
                </>
              ) : (
                <p>Expenses not found</p>
              )}
            </div>
            {availableBudget !== null && (
              <div
                className={styles["fund-available-budget"]}
                style={{ backgroundColor: "#E7FDEA" }}
              >
                <p style={{ color: "#008000" }}>
                  Beschikbaar budget: <br />
                  <span style={{ color: "#008000" }}>€ {availableBudget}</span>
                </p>
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
      <EditActivity
        isOpen={isEditActivityModalOpen}
        onClose={handleToggleEditActivitydModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityEdited={handleActivityEdited}
        initiativeId={initiativeId}
        authToken={user?.token || ""}
        activityId={activityId}
        activityData={currentActivityData}
        activityOwners={activityDetails?.activity_owners || []}
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
        />
      )}
      {activeTab === "details" && <ActivityDetails />}
      {activeTab === "sponsoren" && <ActivitySponsors />}
      {activeTab === "media" && <ActivityMedia />}
      {activeTab === "gebruikers" && <ActivityUsers />}
    </div>
  );
};

export default ActivityDetail;

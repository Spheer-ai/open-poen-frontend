import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivityDetails } from "../middleware/Api";
import EditActivity from "../modals/EditActivity";
import DeleteActivity from "../modals/DeleteActivity";
import LoadingDot from "../animation/LoadingDot";
import { ActivityOwner } from "../../types/ActivityOwners";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import { Activities } from "../../types/ActivitiesTypes";

interface ActivityDetailProps {
  initiativeId: string;
  activityId: string;
  authToken: string;
  entityPermissions: string[];
  onActivityEdited: (updatedActivity: Activities) => void;
  onActivityDeleted: (activityId: string) => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  initiativeId,
  activityId,
  authToken,
  entityPermissions,
  onActivityEdited,
  onActivityDeleted,
}) => {
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const navigate = useNavigate();
  const { user } = useAuth();
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
    setHasEditPermission(entityPermissions.includes("edit"));
    setHasDeletePermission(entityPermissions.includes("delete"));
  }, [entityPermissions]);

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
      }, 300);
    } else {
      setIsDeleteActivityModalOpen(true);
      navigate(
        `/funds/${initiativeId}/activities/${activityId}/delete-activity`,
      );
    }
  };

  const handleActivityEdited = (updatedActivity: Activities) => {
    console.log("Activity edited:", updatedActivity);
    setRefreshTrigger((prev) => prev + 1);
    onActivityEdited(updatedActivity);
  };

  const handleActivityDeleted = () => {
    console.log("Activity deleted, navigating to fund detail");
    onActivityDeleted(activityId);
    navigate(`/funds/${initiativeId}`);
  };

  useEffect(() => {
    if (activityDetails) {
      const spentBudget = activityDetails.expenses || 0;
      const totalBudget = activityDetails.budget || 0;
      const availableBudgetValue = totalBudget + spentBudget;
      setAvailableBudget(availableBudgetValue);
    }
  }, [activityDetails, refreshTrigger]);

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
      </div>
    </>
  );
};

export default ActivityDetail;

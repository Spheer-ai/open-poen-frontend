import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivityDetails } from "../middleware/Api";
import EditActivity from "../modals/EditActivity";
import DeleteActivity from "../modals/DeleteActivity";
import LoadingDot from "../animation/LoadingDot";
import { ActivityOwner } from "../../types/ActivityOwners";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import { Activities, InitiativeData } from "../../types/ActivitiesTypes";
import TabbedActivitiesNavigation from "../ui/layout/navigation/TabbedActivitiesNavigation";
import ActivityDetails from "../elements/tables/activities/ActivityDetails";
import ActivityMedia from "../elements/tables/activities/ActivityMedia";
import ActivitySponsors from "../elements/tables/activities/ActivitySponsors";
import ActivityTransactions from "../elements/tables/activities/ActivityTransactions";
import ActivityUsers from "../elements/tables/activities/ActivityUsers";
import useCachedImages from "../utils/images";

interface ActivityDetailProps {
  initiativeId: string;
  activityId: string;
  authToken: string;
  initiativeData: InitiativeData | null;
  entityPermissions: string[];
  onActivityEdited: (updatedActivity: Activities) => void;
  onActivityDeleted: (activityId: string) => void;
  refreshData: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  initiativeId,
  activityId,
  initiativeData: initialData,
  authToken,
  entityPermissions,
  onActivityEdited,
  onActivityDeleted,
  refreshData,
}) => {
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activityDetails, setActivityDetails] =
    useState<ActivityDetails | null>(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] =
    useState(false);
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
  const [initiativeData, setInitiativeData] = useState<InitiativeData | null>(
    initialData,
  );
  const images = useCachedImages(["edit", "delete"]);

  useEffect(() => {
    setInitiativeData(initialData);
  }, [initialData]);

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
    setHasEditPermission(entityPermissions.includes("edit"));
    setHasDeletePermission(entityPermissions.includes("delete"));
    setHasCreatePaymentPermission(entityPermissions.includes("create_payment"));
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
  }, [activityId, initiativeId, authToken, refreshData]);

  const handleToggleEditActivityModal = () => {
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

  const handleToggleDeleteActivityModal = () => {
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
    onActivityEdited(updatedActivity);
    refreshData(); // Trigger refresh
  };

  const handleActivityDeleted = () => {
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
  }, [activityDetails, refreshData]);

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
              onClick={handleToggleEditActivityModal}
            >
              <img src={images.edit} alt="Edit" className={styles["icon"]} />
              <span>Beheer activiteit</span>
            </button>
          )}
          {hasDeletePermission && (
            <button
              className={styles["edit-button"]}
              onClick={handleToggleDeleteActivityModal}
            >
              <img
                src={images.delete}
                alt="Delete"
                className={styles["icon"]}
              />
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
                    <></>
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
                          Beschikbaar: <br />
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
          onClose={handleToggleEditActivityModal}
          isBlockingInteraction={isBlockingInteraction}
          onActivityEdited={handleActivityEdited}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
          activityId={activityId}
          activityData={currentActivityData}
        />
        <DeleteActivity
          isOpen={isDeleteActivityModalOpen}
          onClose={handleToggleDeleteActivityModal}
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
            onRefreshTrigger={refreshData}
            entityPermissions={entityPermissions}
            activity_name={activityDetails?.name || ""}
            hasCreatePaymentPermission={hasCreatePaymentPermission}
            key={activityId}
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
            grantId={initiativeData?.grant?.id}
            grantName={initiativeData?.grant?.name}
            grantReference={initiativeData?.grant?.reference}
            grantBudget={initiativeData?.grant?.budget}
            token={user?.token || ""}
            key={activeTab}
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
            key={activeTab}
          />
        )}
      </div>
    </>
  );
};

export default ActivityDetail;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import { useAuth } from "../../contexts/AuthContext";
import { fetchActivityDetails } from "../middleware/Api";
import EditActivity from "../modals/EditActivity";
import DeleteActivity from "../modals/DeleteActivity";

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
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  initiativeId,
  activityId,
  authToken,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activityDetails, setActivityDetails] =
    useState<ActivityDetails | null>(null);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] =
    useState(false);

  useEffect(() => {
    if (activityId && authToken) {
      fetchActivityDetails(authToken, initiativeId, activityId)
        .then((data) => {
          setActivityDetails(data);
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

  return (
    <div className={styles["fund-detail-container"]}>
      <button
        className={styles["edit-button"]}
        onClick={handleToggleEditActivitydModal}
      >
        <img src={EditIcon} alt="Edit" className={styles["icon"]} />
        Activiteit beheren
      </button>
      <button
        className={styles["edit-button"]}
        onClick={handleToggleDeleteActivitydModal}
      >
        <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
        Activiteit verwijderen
      </button>
      {activityDetails ? (
        <>
          <div className={styles["activity-image"]}>
            {activityDetails.profile_picture ? (
              <img
                src={
                  activityDetails.profile_picture.attachment_thumbnail_url_512
                }
                alt="Activity Image"
              />
            ) : (
              <p>Image not found</p>
            )}
          </div>
          <div className={styles["activity-info"]}>
            <div className={styles["activity-name"]}>
              {activityDetails.name ? (
                <h2>{activityDetails.name}</h2>
              ) : (
                <p>Name not found</p>
              )}
            </div>
            <div className={styles["activity-description"]}>
              {activityDetails.description ? (
                <p>Description: {activityDetails.description}</p>
              ) : (
                <p>Description not found</p>
              )}
            </div>
            <div className={styles["activity-budget"]}>
              {activityDetails.budget ? (
                <p>Budget: {activityDetails.budget}</p>
              ) : (
                <p>Budget not found</p>
              )}
            </div>
            <div className={styles["activity-income"]}>
              {activityDetails.income ? (
                <p>Income: {activityDetails.income}</p>
              ) : (
                <p>Income not found</p>
              )}
            </div>
            <div className={styles["activity-expenses"]}>
              {activityDetails.expenses ? (
                <p>Expenses: {activityDetails.expenses}</p>
              ) : (
                <p>Expenses not found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading activity details...</p>
      )}
      <EditActivity
        isOpen={isEditActivityModalOpen}
        onClose={handleToggleEditActivitydModal}
        isBlockingInteraction={isBlockingInteraction}
        onActivityEdited={handleActivityEdited}
        initiativeId={initiativeId}
        authToken={user?.token || ""}
        activityId={activityId}
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
  );
};

export default ActivityDetail;

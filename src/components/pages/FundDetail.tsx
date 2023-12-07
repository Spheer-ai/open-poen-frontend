import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import { fetchFundDetails } from "../middleware/Api";
import EditFund from "../modals/EditFund";
import { useAuth } from "../../contexts/AuthContext";

interface FundDetailProps {
  initiativeId: string;
  authToken: string;
  onFundEdited: () => void;
}

interface FundDetails {
  id: number;
  name: string;
  description: string;
  budget: number;
  income: number;
  expenses: number;
  onFundEdited: () => void;
  profile_picture: {
    attachment_thumbnail_url_512: string;
  };
}

const FundDetail: React.FC<FundDetailProps> = ({ initiativeId, authToken }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fundDetails, setFundDetails] = useState<FundDetails | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isEditFundModalOpen, setIsEditFundModalOpen] = useState(false);

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
  }, [initiativeId, authToken, refreshTrigger]);

  const handleToggleEditFundModal = () => {
    if (isEditFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditFundModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsEditFundModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/edit-fund`);
    }
  };

  const handleFundEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles["fund-detail-container"]}>
      <>
        <button
          className={styles["edit-button"]}
          onClick={handleToggleEditFundModal}
        >
          <img src={EditIcon} alt="Edit" className={styles["icon"]} />
          Initiatief beheren
        </button>
      </>
      {fundDetails ? (
        <>
          <div className={styles["fund-image"]}>
            {fundDetails.profile_picture ? (
              <img
                src={fundDetails.profile_picture.attachment_thumbnail_url_512}
                alt="Fund Image"
              />
            ) : (
              <p>Image not found</p>
            )}
          </div>
          <div className={styles["fund-info"]}>
            <div className={styles["fund-name"]}>
              {fundDetails.name ? (
                <h2>{fundDetails.name}</h2>
              ) : (
                <p>Name not found</p>
              )}
            </div>
            <div className={styles["fund-description"]}>
              {fundDetails.description ? (
                <p>Description: {fundDetails.description}</p>
              ) : (
                <p>Description not found</p>
              )}
            </div>
            <div className={styles["fund-budget"]}>
              {fundDetails.budget ? (
                <p>Budget: {fundDetails.budget}</p>
              ) : (
                <p>Budget not found</p>
              )}
            </div>
            <div className={styles["fund-income"]}>
              {fundDetails.income ? (
                <p>Income: {fundDetails.income}</p>
              ) : (
                <p>Income not found</p>
              )}
            </div>
            <div className={styles["fund-expenses"]}>
              {fundDetails.expenses ? (
                <p>Expenses: {fundDetails.expenses}</p>
              ) : (
                <p>Expenses not found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Loading fund details...</p>
      )}
      <EditFund
        isOpen={isEditFundModalOpen}
        onClose={handleToggleEditFundModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundEdited={handleFundEdited}
        initiativeId={initiativeId}
        authToken={user?.token || ""}
      />
    </div>
  );
};

export default FundDetail;

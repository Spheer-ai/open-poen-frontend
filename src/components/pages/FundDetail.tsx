import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [activeTab, setActiveTab] = useState("transactieoverzicht");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleToggleDeleteFundModal = () => {
    if (isDeleteFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteFundModalOpen(false);
        navigate(`/funds/${initiativeId}/activities`);
      }, 300);
    } else {
      setIsDeleteFundModalOpen(true);
      navigate(`/funds/${initiativeId}/activities/delete-fund`);
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

  return (
    <div className={styles["fund-detail-container"]}>
      <>
        <div className={styles["top-right-button-container"]}>
          <button
            className={styles["edit-button"]}
            onClick={handleToggleEditFundModal}
          >
            <img src={EditIcon} alt="Edit" className={styles["icon"]} />
            Beheer initiatief
          </button>
          <button
            className={styles["edit-button"]}
            onClick={handleToggleDeleteFundModal}
          >
            <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
            Verwijder initiatief
          </button>
        </div>
      </>
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
                        : `${fundDetails.description.slice(0, 150)}...`}
                    </p>
                    {fundDetails.description.length > 150 && (
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
                  src={fundDetails.profile_picture.attachment_thumbnail_url_512}
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
              {fundDetails.budget ? (
                <>
                  <p>
                    Toegekend budget: <br />
                    <span>€ {fundDetails.budget} </span>
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
              {fundDetails.income ? (
                <>
                  <p>
                    Ontvangen budget: <br />
                    <span>€ {fundDetails.income}</span>
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
              {fundDetails.expenses ? (
                <>
                  <p style={{ color: "#B82466" }}>
                    Besteed:
                    <br />
                    <span style={{ color: "#B82466" }}>
                      € {fundDetails.expenses}
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
      <EditFund
        isOpen={isEditFundModalOpen}
        onClose={handleToggleEditFundModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundEdited={handleFundEdited}
        initiativeId={initiativeId}
        authToken={user?.token || ""}
        fundData={currentFundData}
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
        />
      )}
      {activeTab === "activiteiten" && <FundsActivities />}
      {activeTab === "details" && <FundsDetails />}
      {activeTab === "sponsoren" && <FundsSponsors />}
      {activeTab === "media" && <FundsMedia />}
      {activeTab === "gebruikers" && <FundsUsers />}
    </div>
  );
};

export default FundDetail;

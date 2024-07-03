import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/pages/FundDetail.module.scss";
import EditIcon from "/edit-icon.svg";
import DeleteIcon from "/bin-icon.svg";
import EditFund from "../modals/EditFund";
import { useAuth } from "../../contexts/AuthContext";
import DeleteFund from "../modals/DeleteFund";
import LoadingDot from "../animation/LoadingDot";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import { InitiativeOwner } from "../../types/InitiativeOwners";

interface FundDetailProps {
  initiativeId: string;
  authToken: string;
  initiativeData: any;
  entityPermissions: string[];
  onFundEdited: () => void;
}

const FundDetail: React.FC<FundDetailProps> = ({
  initiativeId,
  authToken,
  initiativeData,
  entityPermissions,
  onFundEdited,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);
  const [hasCreatePaymentPermission, setHasCreatePaymentPermission] =
    useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [availableBudget, setAvailableBudget] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isEditFundModalOpen, setIsEditFundModalOpen] = useState(false);
  const [isDeleteFundModalOpen, setIsDeleteFundModalOpen] = useState(false);

  useEffect(() => {
    setHasEditPermission(entityPermissions.includes("edit"));
    setHasDeletePermission(entityPermissions.includes("delete"));
    setHasCreatePaymentPermission(entityPermissions.includes("create_payment"));
  }, [entityPermissions]);

  useEffect(() => {
    if (initiativeData) {
      const spentBudget = initiativeData.expenses || 0;
      const totalBudget = initiativeData.budget || 0;
      const availableBudgetValue = totalBudget + spentBudget;
      setAvailableBudget(availableBudgetValue);
    }
  }, [initiativeData, refreshTrigger]);

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
    onFundEdited();
  };

  const handleToggleDeleteFundModal = () => {
    if (isDeleteFundModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteFundModalOpen(false);
      }, 300);
    } else {
      setIsDeleteFundModalOpen(true);
      navigate(`/funds/${initiativeId}/delete-fund`);
    }
  };

  const handleFundDeleted = () => {
    setRefreshTrigger((prev) => prev);
  };

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
                {initiativeData?.name}
              </Link>,
            ]}
          />
        </div>
        <div className={styles["top-right-button-container"]}>
          {hasEditPermission && (
            <button
              className={styles["edit-button"]}
              onClick={handleToggleEditFundModal}
            >
              <img src={EditIcon} alt="Edit" className={styles["icon"]} />
              <span>Beheer initiatief</span>
            </button>
          )}
          {hasDeletePermission && (
            <button
              className={styles["edit-button"]}
              onClick={handleToggleDeleteFundModal}
            >
              <img src={DeleteIcon} alt="Delete" className={styles["icon"]} />
              <span>Verwijder initiatief</span>
            </button>
          )}
        </div>
      </div>
      <div className={styles["fund-detail-container"]}>
        <div className={styles["content-wrapper"]}>
          {initiativeData ? (
            <>
              <div className={styles["content-container"]}>
                <div className={styles["fund-image"]}>
                  {initiativeData.profile_picture ? (
                    <img
                      src={
                        initiativeData.profile_picture
                          .attachment_thumbnail_url_512
                      }
                      alt=""
                    />
                  ) : (
                    <p>Geen afbeelding gevonden</p>
                  )}
                </div>
                <div className={styles["fund-info"]}>
                  <div className={styles["fund-name"]}>
                    {initiativeData.name ? (
                      <h1>{initiativeData.name}</h1>
                    ) : (
                      <p>Geen naam gevonden</p>
                    )}
                  </div>
                  <div className={styles["fund-description"]}>
                    {initiativeData.description ? (
                      <div>
                        <p>
                          {showFullDescription
                            ? initiativeData.description
                            : `${initiativeData.description.slice(0, 250)}${
                                initiativeData.description.length > 250
                                  ? "..."
                                  : ""
                              }`}
                        </p>
                        {initiativeData.description.length > 250 && (
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
                  {initiativeData.budget !== null ? (
                    <>
                      <p>Toegekend budget:</p>
                      <span>
                        €{" "}
                        {initiativeData.budget.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <div className={styles["tooltip"]}>
                        <span className={styles["tooltip-text"]}>
                          Waarvan ontvangen: €{" "}
                          {initiativeData.income.toLocaleString("nl-NL", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p>Geen toegekend budget gevonden</p>
                  )}
                </div>
                <div className={styles["fund-expenses"]}>
                  {initiativeData.expenses !== null ? (
                    <>
                      <p>Besteed:</p>
                      <span style={{ color: "#B82466" }}>
                        €{" "}
                        {Math.abs(initiativeData.expenses).toLocaleString(
                          "nl-NL",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                      </span>
                    </>
                  ) : (
                    <p>Geen besteed budget gevonden</p>
                  )}
                </div>
                {availableBudget !== null && (
                  <div className={styles["fund-available-budget"]}>
                    <>
                      <p>Beschikbaar budget:</p>
                      <span style={{ color: "#008000" }}>
                        €{" "}
                        {availableBudget.toLocaleString("nl-NL", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </>
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
        <EditFund
          isOpen={isEditFundModalOpen}
          onClose={handleToggleEditFundModal}
          isBlockingInteraction={isBlockingInteraction}
          onFundEdited={handleFundEdited}
          initiativeId={initiativeId}
          authToken={user?.token || ""}
          fundData={initiativeData}
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
      </div>
    </>
  );
};

export default FundDetail;

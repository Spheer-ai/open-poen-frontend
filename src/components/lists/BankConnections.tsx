import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../assets/scss/BankList.module.scss";
import AddBankConnectionModal from "../modals/AddBankConnectionModal";
import { useAuth } from "../../contexts/AuthContext";
import { fetchBankConnections } from "../middleware/Api";
import { format, differenceInDays } from "date-fns";
import InviteBankUsersModal from "../modals/InviteBankUsersModal";
import DeleteBankAccountModal from "../modals/DeleteBankAccountModal";

type BankConnection = {
  id: number;
  name: string;
  iban: string;
  expiration_date: string;
  user_count: number;
  institution_logo: string | null;
  institution_name: string;
};

const BankConnections = () => {
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [isAddBankConnectionModalOpen, setIsAddBankConnectionModalOpen] =
    useState(false);
  const [isInviteBankUsersModalOpen, setIsInviteBankUsersModalOpen] =
    useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [isRevokeBankModalOpen, setIsRevokeBankModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const userId = user?.userId ? user.userId.toString() : null;
  const token = user?.token ? user.token.toString() : null;
  const userIdAsNumber = user?.userId || 0;
  const userIdAsString = userIdAsNumber.toString();
  const [modalTitle, setModalTitle] = useState("Bank account toevoegen");
  const [ownedBankConnections, setOwnedBankConnections] = useState<
    BankConnection[]
  >([]);
  const [usedBankConnections, setUsedBankConnections] = useState<
    BankConnection[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleToggleRevokeBankModal = (bankId: number | null) => {
    if (isRevokeBankModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsRevokeBankModalOpen(false);
        navigate("/transactions/bankconnections");
      }, 300);
    } else {
      setIsRevokeBankModalOpen(true);
      setSelectedBankId(bankId);
      navigate("/transactions/bankconnections/revoke-bank");
    }
  };

  const handleBankRevoked = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.userId && user.token) {
        try {
          const data = await fetchBankConnections(user.userId, user.token);
          const ownedAccounts = data.ownedBankAccounts || [];
          const usedAccounts = data.usedBankAccounts || [];

          const filteredOwnedAccounts = ownedAccounts.filter(
            (account) => !account.is_revoked,
          );

          const filteredUsedAccounts = usedAccounts.filter(
            (account) => !account.is_revoked,
          );

          setOwnedBankConnections(filteredOwnedAccounts);
          setUsedBankConnections(filteredUsedAccounts);

          console.log(
            "Fetched bank connections:",
            filteredOwnedAccounts,
            filteredUsedAccounts,
          );
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching bank connections:", error);
        }
      }
    };

    fetchData();
  }, [user, refreshTrigger]);
  useEffect(() => {
    if (location.pathname === "/transactions/bankconnections/add-bank") {
      setIsAddBankConnectionModalOpen(true);
    }
  }, [location.pathname]);

  const handleToggleAddBankModal = (title: string) => {
    if (isAddBankConnectionModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsAddBankConnectionModalOpen(false);
        navigate(`/transactions/bankconnections`);
      }, 300);
    } else {
      setIsAddBankConnectionModalOpen(true);
      setModalTitle(title);
      navigate(`/transactions/bankconnections/add-bank`);
    }
  };

  const handleToggleAddBankModalWrapper = (
    title: string,
    institutionId?: string,
  ) => {
    if (institutionId) {
      setIsBlockingInteraction(true);
      setSelectedBank(institutionId);
      setIsAddBankConnectionModalOpen(true);
      setModalTitle(title);
    } else {
      handleToggleAddBankModal(title);
    }
  };

  const handleToggleInviteBankUsersModal = (bankId: number | null) => {
    if (isInviteBankUsersModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsInviteBankUsersModalOpen(false);
        navigate(`/transactions/bankconnections`);
      }, 300);
    } else {
      setIsInviteBankUsersModalOpen(true);
      setSelectedBankId(bankId);
      console.log("Selected Bank ID:", bankId);
      navigate(`/transactions/bankconnections/invite-user`);
    }
  };

  const calculateDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const daysUntilExpiration = differenceInDays(expiration, today);

    return daysUntilExpiration;
  };

  return (
    <>
      <div className={styles["scrollable-container"]}>
        <div className={styles["bank-connections-container"]}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <section>
                <h3 className={styles["section-title"]}>
                  Jouw gekoppelde rekeningnummers
                </h3>
                <ul>
                  {Array.isArray(ownedBankConnections) &&
                  ownedBankConnections.length > 0 ? (
                    ownedBankConnections.map((connection) => (
                      <li key={connection.id} className={styles["bank-item"]}>
                        <div className={styles["bank-details"]}>
                          {connection.institution_logo !== null ? (
                            <img
                              src={connection.institution_logo}
                              alt={`${connection.name} Logo`}
                              className={styles["bank-logo"]}
                            />
                          ) : (
                            connection.institution_name === "Sandbox" && (
                              <img
                                src="/sandbox-bank.png"
                                alt="Sandbox Bank Logo"
                                className={styles["bank-logo"]}
                              />
                            )
                          )}
                          <div className={styles["bank-info"]}>
                            <span className={styles["bank-name"]}>
                              {connection.institution_name}
                            </span>
                            <span className={styles["name"]}>
                              {connection.name}
                            </span>
                            <span className={styles["bank-iban"]}>
                              IBAN: {connection.iban}
                            </span>
                            <span className={styles["bank-expiration"]}>
                              Vervalt op:{" "}
                              {format(
                                new Date(connection.expiration_date),
                                "dd MMM yyyy",
                              )}{" "}
                              (
                              {calculateDaysUntilExpiration(
                                connection.expiration_date,
                              )}{" "}
                              dagen)
                            </span>
                          </div>
                        </div>
                        <div className={styles["bank-options"]}>
                          <span className={styles["bank-user-count"]}>
                            {connection.user_count === 1 ? (
                              <span>
                                Gedeeld met <b>1 persoon</b>
                              </span>
                            ) : connection.user_count > 1 ? (
                              <span>
                                Gedeeld met{" "}
                                <b>{connection.user_count} personen</b>
                              </span>
                            ) : (
                              "Niet gedeeld met personen"
                            )}
                          </span>
                          <button
                            className={styles["saveButton"]}
                            onClick={() =>
                              handleToggleAddBankModalWrapper(
                                "Bank account vernieuwen",
                              )
                            }
                          >
                            Vernieuw nu
                          </button>
                          <button
                            onClick={() =>
                              handleToggleInviteBankUsersModal(connection.id)
                            }
                          >
                            Personen uitnodigen
                          </button>

                          <button
                            onClick={() =>
                              handleToggleRevokeBankModal(connection.id)
                            }
                            className={styles["button-danger"]}
                          >
                            Verwijderen
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>Geen bankkoppelingen gevonden...</li>
                  )}
                </ul>
              </section>

              <section>
                <h3 className={styles["section-title"]}>
                  Met jouw gedeelde rekeningnummers
                </h3>
                <ul>
                  {Array.isArray(usedBankConnections) &&
                  usedBankConnections.length > 0 ? (
                    usedBankConnections.map((connection) => (
                      <li key={connection.id} className={styles["bank-item"]}>
                        <div className={styles["bank-details"]}>
                          {connection.institution_logo !== null ? (
                            <img
                              src={connection.institution_logo}
                              alt={`${connection.institution_name} Logo`}
                              className={styles["bank-logo"]}
                            />
                          ) : (
                            connection.institution_name === "Sandbox" && (
                              <img
                                src="/sandbox-bank.png"
                                alt="Sandbox Bank Logo"
                                className={styles["bank-logo"]}
                              />
                            )
                          )}
                          <div className={styles["bank-info"]}>
                            <span className={styles["bank-name"]}>
                              {connection.institution_name}
                            </span>
                            <span className={styles["name"]}>
                              {connection.name}
                            </span>
                            <span className={styles["bank-iban"]}>
                              IBAN: {connection.iban}
                            </span>
                            <span className={styles["bank-expiration"]}>
                              Vervalt op:{" "}
                              {format(
                                new Date(connection.expiration_date),
                                "dd MMM yyyy",
                              )}{" "}
                              (
                              {calculateDaysUntilExpiration(
                                connection.expiration_date,
                              )}{" "}
                              dagen)
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li>Geen gedeelde bankrekeningnummers gevonden...</li>
                  )}
                </ul>
              </section>

              <InviteBankUsersModal
                isOpen={isInviteBankUsersModalOpen}
                onClose={() => handleToggleInviteBankUsersModal(null)}
                isBlockingInteraction={isBlockingInteraction}
                bankAccountId={selectedBankId}
                userId={userId as any}
                token={token || ""}
              />
              <DeleteBankAccountModal
                isOpen={isRevokeBankModalOpen}
                onClose={() => handleToggleRevokeBankModal}
                isBlockingInteraction={isBlockingInteraction}
                userId={userId as any}
                token={token ? token.toString() : ""}
                bankAccountId={selectedBankId}
                onBankRevoked={handleBankRevoked}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles["button-container"]}>
        <button
          className={styles["saveButton"]}
          onClick={() =>
            handleToggleAddBankModalWrapper("Bank account toevoegen")
          }
        >
          Bankrekening toevoegen
        </button>
        <AddBankConnectionModal
          isOpen={isAddBankConnectionModalOpen}
          onClose={(title) => handleToggleAddBankModal(title)}
          isBlockingInteraction={isBlockingInteraction}
          isReconnecting={true}
          title={modalTitle}
        />
      </div>
    </>
  );
};

export default BankConnections;

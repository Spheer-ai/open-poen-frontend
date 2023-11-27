import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import styles from "../../assets/scss/Funds.module.scss";
import AddFundDesktop from "../modals/AddFundDesktop";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";
import { fetchInitiatives } from "../middleware/Api";

interface Initiative {
  id: number;
  name: string;
  budget: number;
  income: number;
  expenses: number;
}

export default function Funds() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);

  useEffect(() => {
    if (user?.token && !permissionsFetched) {
      fetchPermissions("Funder", undefined, user.token)
        .then((permissions) => {
          console.log("Fetched permissions:", permissions);
          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        });
    } else {
      console.log("Token is not available or permissions are already fetched.");
    }
  }, [user, fetchPermissions, permissionsFetched]);

  useEffect(() => {
    if (user?.token) {
      fetchInitiatives(user.token)
        .then((initiativesData) => {
          console.log("Fetched initiatives:", initiativesData);
          const updatedInitiatives = [...(initiativesData || [])];

          setInitiatives(updatedInitiatives);
        })
        .catch((error) => {
          console.error("Error fetching initiatives:", error);
        });
    }
  }, [user, permissionsFetched, refreshTrigger]);

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleToggleAddFundModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(!isModalOpen);
        navigate(`/funds`);
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate(`/funds/add-fund`);
    }
  };

  const handleFundAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const navigateToActivities = (initiativeId) => {
    navigate(`/funds/${initiativeId}/activities`);
  };

  const calculateBarWidth = (income, expenses) => {
    const total = income + expenses;
    if (total === 0) {
      return {
        incomeWidth: "50%",
        expensesWidth: "50%",
      };
    }
    const incomeWidth = `${(income / total) * 100}%`;
    const expensesWidth = `${(expenses / total) * 100}%`;
    return {
      incomeWidth,
      expensesWidth,
    };
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title={`Initiatieven ${initiatives.length}`}
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddFundModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        {initiatives.length === 0 ? (
          <p>Initiatieven worden geladen...</p>
        ) : (
          <ul className={styles["shared-unordered-list"]}>
            {initiatives.map((initiative) => (
              <div className={styles["shared-styling"]} key={initiative.id}>
                <li className={styles["shared-name"]}>
                  <a onClick={() => navigateToActivities(initiative.id)}>
                    <strong>{initiative.name}</strong>
                  </a>
                </li>
                <div className={styles["values-bar"]}>
                  <div
                    key={`income-${initiative.id}`}
                    className={styles["income-bar"]}
                    style={{
                      width: calculateBarWidth(
                        initiative.income,
                        initiative.expenses,
                      ).incomeWidth,
                    }}
                  ></div>
                  <div
                    key={`expenses-${initiative.id}`}
                    className={styles["expenses-bar"]}
                    style={{
                      width: calculateBarWidth(
                        initiative.income,
                        initiative.expenses,
                      ).expensesWidth,
                    }}
                  ></div>
                </div>
                <li className={styles["shared-list"]}>
                  <div className={styles["shared-values"]}>
                    <label>Begroting:</label>
                    <span>€{initiative.budget}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        initiative.income
                          ? styles["value-income"]
                          : styles["value-expenses"]
                      }
                    >
                      Beschikbaar:
                    </label>
                    <span>€{initiative.income}</span>
                  </div>
                  <div className={styles["shared-values"]}>
                    <label
                      className={
                        initiative.expenses
                          ? styles["value-expenses"]
                          : styles["value-income"]
                      }
                    >
                      Besteed:
                    </label>
                    <span>€{initiative.expenses}</span>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
      <AddFundDesktop
        isOpen={isModalOpen}
        onClose={handleToggleAddFundModal}
        isBlockingInteraction={isBlockingInteraction}
        onFundAdded={handleFundAdded}
        funderId={1}
        regulationId={4}
        grantId={3}
      />
    </div>
  );
}

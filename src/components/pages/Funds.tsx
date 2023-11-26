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
          setInitiatives(initiativesData || []);
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

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Initiatieven"
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddFundModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        {initiatives.length === 0 ? (
          <p>Geen resultaten gevonden</p>
        ) : (
          <ul>
            {initiatives.map((initiative) => (
              <li key={initiative.id}>
                <a onClick={() => navigateToActivities(initiative.id)}>
                  <strong>{initiative.name}</strong>
                </a>
                <br />
                Budget: €{initiative.budget}
                <br />
                Income: €{initiative.income}
                <br />
                Expenses: €{initiative.expenses}
              </li>
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

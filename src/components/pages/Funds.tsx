import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import PageContent from "../ui/layout/PageContent";
import styles from "../../assets/scss/Funds.module.scss";
import AddFundDesktop from "../modals/AddFundDesktop";
import { usePermissions } from "../../contexts/PermissionContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Funds() {
  const navigate = useNavigate();
  const { action } = useParams();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(action === "add-funds");
  const [showPageContent, setShowPageContent] = useState(false);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");

  useEffect(() => {
    console.log("action:", action);

    if (user && user.token && !permissionsFetched) {
      fetchPermissions("Funder", undefined, user.token)
        .then((permissions) => {
          setEntityPermissions(permissions || []);
          setPermissionsFetched(true);
        })
        .catch((error) => {
          console.error("Failed to fetch permissions:", error);
          setPermissionsFetched(true);
        });
    }
  }, [action, user, fetchPermissions, permissionsFetched]);

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleShowPageContent = () => {
    setShowPageContent(true);
    navigate("/funds/detail");
  };

  const handleClosePageContent = () => {
    setShowPageContent(false);
    navigate("/funds");
  };

  const handleToggleAddFundModal = () => {
    if (isModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate("/funds");
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate("/funds/add-funds");
    }
  };

  return (
    <>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Initiatieven"
          showSettings={true}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddFundModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
        />
      </div>
      <AddFundDesktop
        isOpen={isModalOpen}
        onClose={handleToggleAddFundModal}
        isBlockingInteraction={isBlockingInteraction}
      />
      <button onClick={handleShowPageContent}>
        {showPageContent ? "Close PageContent" : "Show PageContent"}
      </button>

      <button onClick={handleToggleAddFundModal}>Add Fund</button>

      {showPageContent && (
        <PageContent
          showContent={showPageContent}
          onClose={handleClosePageContent}
          children={undefined}
        ></PageContent>
      )}
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../assets/scss/Sponsors.module.scss";
import { usePermissions } from "../../contexts/PermissionContext";
import { fetchSponsors, getFunderById } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import SponsorDropdown from "../elements/dropdown-menu/SponsorDropDown";
import EditSponsor from "../modals/EditSponsor";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import AddSponsorDesktop from "../modals/AddSponsorDesktop";
import DeleteSponsor from "../modals/DeleteSponsor";

type Sponsor = {
  id: string;
  name: string;
  url: string;
};

const SponsorList = () => {
  const { sponsorId } = useParams<{ sponsorId?: string }>();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isBlockingInteraction, setIsBlockingInteraction] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeSponsorId] = useState<string | null>(null);
  const { fetchPermissions } = usePermissions();
  const [permissionsFetched, setPermissionsFetched] = useState(false);
  const [entityPermissions, setEntityPermissions] = useState<string[]>([]);
  const hasPermission = entityPermissions.includes("create");
  const [isEditSponsorModalOpen, setIsEditSponsorModalOpen] = useState(false);
  const [isDeleteSponsorModalOpen, setIsDeleteSponsorModalOpen] =
    useState(false);
  const [hasEditSponsorPermission] = useState(false);
  const [permissionsFetchedForSession, setPermissionsFetchedForSession] =
    useState(false);
  const [fetchedSponsorPermissions, setFetchedSponsorPermissions] = useState<{
    [key: string]: string[];
  }>({});

  const navigate = useNavigate();
  const [selectedSponsorData, setSelectedSponsorData] =
    useState<Sponsor | null>(null);

  useEffect(() => {
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
  }, [user, fetchPermissions, permissionsFetched]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSponsors();
        setSponsors(data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    if (user && user.token && sponsors.length > 0 && !permissionsFetched) {
      const fetchEditPermissions = async () => {
        const permissionsMap: { [key: string]: string[] } = {};

        for (const sponsor of sponsors) {
          try {
            const permissions = await fetchPermissions(
              "Funder",
              parseInt(sponsor.id),
              user.token,
            );
            permissionsMap[sponsor.id] = permissions || [];
          } catch (error) {
            console.error("Error fetching permissions:", error);
            permissionsMap[sponsor.id] = [];
          }
        }

        setFetchedSponsorPermissions(permissionsMap);
      };

      fetchEditPermissions();
    }
  }, [user, sponsors, fetchPermissions, permissionsFetched]);

  const handleSponsorClick = (sponsorId: string) => {
    if (user && user.token) {
      if (!permissionsFetchedForSession) {
        fetchPermissions("Funder", undefined, user.token)
          .then((permissions) => {
            setEntityPermissions(permissions || []);
            setPermissionsFetchedForSession(true);
          })
          .catch((error) => {
            console.error("Failed to fetch permissions:", error);
            setPermissionsFetchedForSession(true);
          });
      }

      navigate(`/sponsors/${sponsorId}/regulations`);
    } else {
      console.error("User is not authenticated or does not have a token.");
    }
  };

  useEffect(() => {
    const fetchSpecificSponsorData = async () => {
      if (sponsorId && user && user.token) {
        try {
          const sponsorData = await getFunderById(
            user.token,
            parseInt(sponsorId),
          );
          console.log("Fetched sponsor data:", sponsorData);
          setSelectedSponsorData(sponsorData);
        } catch (error) {
          console.error("Error fetching specific sponsor:", error);
        }
      }
    };

    fetchSpecificSponsorData();
  }, [sponsorId, user]);

  const handleToggleEditSponsorModal = (sponsorId?: string) => {
    console.log("sponsorId in handleToggleEditSponsorModal:", sponsorId);
    if (isEditSponsorModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsEditSponsorModalOpen(false);
        navigate(`/sponsors`);
      }, 300);
    } else {
      setIsEditSponsorModalOpen(true);
      navigate(`/sponsors/${sponsorId}/edit-sponsor`);
    }
  };

  const handleSponsorEdited = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleDeleteSponsorModal = (sponsorId?: string) => {
    console.log("sponsorId in handleToggleDeleteSponsorModal:", sponsorId);
    if (isDeleteSponsorModalOpen) {
      setIsBlockingInteraction(true);
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsDeleteSponsorModalOpen(false);
        navigate(`/sponsors`);
      }, 300);
    } else {
      setIsDeleteSponsorModalOpen(true);
      navigate(`/sponsors/${sponsorId}/delete-sponsor`);
    }
  };

  const handleSponsorDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleAddSponsorModal = () => {
    if (isModalOpen) {
      setTimeout(() => {
        setIsBlockingInteraction(false);
        setIsModalOpen(false);
        navigate("/sponsors");
      }, 300);
    } else {
      setIsModalOpen(true);
      navigate("/sponsors/add-sponsor");
    }
  };

  const handleSponsorAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title="Sponsors"
          showSettings={false}
          showCta={true}
          onSettingsClick={() => {}}
          onCtaClick={handleToggleAddSponsorModal}
          onSearch={handleSearch}
          hasPermission={hasPermission}
          showSearch={false}
        />
        <div>
          <ul className={styles["sponsor-list"]}>
            {sponsors.map((sponsor) => {
              const isActive = activeSponsorId === sponsor.id.toString();
              const permissions =
                fetchedSponsorPermissions[sponsor.id.toString()];
              const hasEditPermission =
                Array.isArray(permissions) && permissions.includes("edit");
              const hasDeletePermission =
                Array.isArray(permissions) && permissions.includes("delete");

              return (
                <li
                  key={sponsor.id}
                  className={`${styles["sponsor-list-item"]} ${
                    isActive ? styles["active-sponsor"] : ""
                  }`}
                >
                  <div
                    className={styles["sponsor-info"]}
                    onClick={() => handleSponsorClick(sponsor.id.toString())}
                  >
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles["sponsor-link"]}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSponsorClick(sponsor.id.toString());
                      }}
                    >
                      {sponsor.name}
                    </a>
                    <p className={styles["sponsor-website"]}>{sponsor.url}</p>
                  </div>
                  {hasEditPermission && (
                    <SponsorDropdown
                      isOpen={false}
                      onEditClick={() =>
                        handleToggleEditSponsorModal(sponsor.id.toString())
                      }
                      onDeleteClick={() =>
                        handleToggleDeleteSponsorModal(sponsor.id.toString())
                      }
                      sponsorId={sponsor.id.toString()}
                      userPermissions={hasEditPermission}
                      hasDeletePermission={hasDeletePermission}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <EditSponsor
            isOpen={isEditSponsorModalOpen}
            onClose={handleToggleEditSponsorModal}
            isBlockingInteraction={isBlockingInteraction}
            onSponsorEdited={handleSponsorEdited}
            sponsorId={sponsorId}
            hasEditSponsorPermission={hasEditSponsorPermission}
            currentName={selectedSponsorData?.name || ""}
            currentUrl={selectedSponsorData?.url || ""}
          />
          <DeleteSponsor
            isOpen={isDeleteSponsorModalOpen}
            onClose={handleToggleDeleteSponsorModal}
            isBlockingInteraction={isBlockingInteraction}
            onSponsorDeleted={handleSponsorDeleted}
            sponsorId={sponsorId}
          />
        </div>
      </div>
      <AddSponsorDesktop
        isOpen={isModalOpen}
        onClose={handleToggleAddSponsorModal}
        isBlockingInteraction={isBlockingInteraction}
        onSponsorAdded={handleSponsorAdded}
      />
    </div>
  );
};

export default SponsorList;

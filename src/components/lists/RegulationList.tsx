import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../assets/scss/RegulationList.module.scss";
import TopNavigationBar from "../ui/top-navigation-bar/TopNavigationBar";
import { fetchFunderRegulations } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../contexts/PermissionContext";
import RegulationDetail from "../pages/RegulationDetail";

type Regulation = {
  id: string;
  name: string;
};

const RegulationList = () => {
  const { sponsorId } = useParams<{ sponsorId: string }>();
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const { user } = useAuth();
  const { globalPermissions } = usePermissions();
  const [selectedRegulationId, setSelectedRegulationId] = useState<
    string | null
  >(null);

  const token = user?.token;
  useParams();

  useEffect(() => {
    async function getRegulations() {
      try {
        console.log("Checking values: token", token);
        console.log("Checking values: sponsorId", sponsorId);
        if (token && sponsorId) {
          const fetchedRegulations = await fetchFunderRegulations(
            token,
            sponsorId,
          );
          setRegulations(fetchedRegulations);

          if (fetchedRegulations && fetchedRegulations.length > 0) {
            setSelectedRegulationId(fetchedRegulations[0].id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch regulations:", error);
      }
    }

    getRegulations();
  }, [sponsorId, token]);

  const handleBackClick = () => {
    navigate("/sponsors");
  };

  const handleSearch = (query) => {
    console.log("Search query in UserDetailsPage:", query);
  };

  const handleRegulationClick = (regulationId: string) => {
    setSelectedRegulationId(regulationId);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["side-panel"]}>
        <TopNavigationBar
          title={`Regelingen ${sponsorId}`}
          onBackArrowClick={handleBackClick}
          showSettings={true}
          showCta={true}
          onSettingsClick={() => {}}
          onSearch={handleSearch}
          onCtaClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          globalPermissions={globalPermissions}
        />

        {regulations.length > 0 ? (
          <ul className={styles["regulation-list"]}>
            {regulations.map((regulation) => (
              <li
                key={regulation.id}
                className={styles["regulation-list-item"]}
                onClick={() => handleRegulationClick(regulation.id)}
              >
                <div className={styles["regulation-info"]}>
                  {regulation.name}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Geen gegevens gevonden</p>
        )}
      </div>
      {selectedRegulationId && (
        <div className={styles["detail-panel"]}>
          <RegulationDetail regulationId={selectedRegulationId} />
        </div>
      )}
    </div>
  );
};

export default RegulationList;

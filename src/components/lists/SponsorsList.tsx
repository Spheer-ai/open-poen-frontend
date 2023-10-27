import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/scss/SponsorList.module.scss";
import { useFetchPermissions } from "../hooks/useFetchPermissions";
import { fetchSponsors } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";

type Sponsor = {
  id: number;
  name: string;
  url: string;
};

interface SponsorListProps {
  onShowPageContent: (sponsorId: string) => void;
  refreshTrigger: number;
}

const SponsorList: React.FC<SponsorListProps> = ({ refreshTrigger }) => {
  const { fetchPermissions } = useFetchPermissions();
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeSponsorId] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleSponsorClick = (sponsorId: string) => {
    if (user && user.token) {
      fetchPermissions("Funder", parseInt(sponsorId), user.token)
        .then((permissions) => {
          console.log("Permissions for sponsor:", permissions);
          navigate(`/sponsors/${sponsorId}/regulations`);
        })
        .catch((error) => {
          console.error("Error fetching permissions:", error);
        });
    } else {
      console.error("User is not authenticated or does not have a token.");
    }
  };

  return (
    <div>
      <ul className={styles["sponsor-list"]}>
        {sponsors.map((sponsor) => {
          const isActive = activeSponsorId === sponsor.id.toString();
          return (
            <li
              key={sponsor.id}
              onClick={() => handleSponsorClick(sponsor.id.toString())}
              className={`${styles["sponsor-list-item"]} ${
                isActive ? styles["active-sponsor"] : ""
              }`}
            >
              <div className={styles["sponsor-info"]}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["sponsor-link"]}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSponsorClick(sponsor.id.toString());
                  }}
                >
                  {sponsor.name}
                </a>
                <p className={styles["sponsor-website"]}>{sponsor.url}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SponsorList;

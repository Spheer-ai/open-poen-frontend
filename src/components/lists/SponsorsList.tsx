import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSponsors } from "../middleware/Api";
import styles from "../../assets/scss/SponsorList.module.scss";

type Sponsor = {
  id: number;
  name: string;
  url: string;
};

interface SponsorListProps {
  onShowPageContent: (sponsorId: string) => void;
}

const SponsorList: React.FC<SponsorListProps> = ({ onShowPageContent }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeSponsorId, setActiveSponsorId] = useState<string | null>(null);

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
  }, []);

  // Define the function to handle showing content when a sponsor is clicked
  const handleSponsorClick = (sponsorId: string) => {
    setActiveSponsorId(sponsorId);
    // Trigger the "Show PageContent" behavior
    onShowPageContent(sponsorId);
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
                    e.preventDefault(); // Prevent link navigation
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

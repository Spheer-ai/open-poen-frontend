import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSponsors } from "../middleware/Api";

type Sponsor = {
  id: number;
  name: string;
  url: string;
};

interface SponsorListProps {
  onShowPageContent: (sponsorId: string) => void; // Change the type to string
}

const SponsorList: React.FC<SponsorListProps> = ({ onShowPageContent }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

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

  return (
    <div>
      <ul>
        {sponsors.map((sponsor) => (
          <li key={sponsor.id}>
            <a target="_blank" rel="noopener noreferrer">
              {sponsor.name}
            </a>
            <button onClick={() => onShowPageContent(sponsor.id.toString())}>
              Show PageContent
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SponsorList;

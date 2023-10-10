import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSponsorById } from "../middleware/Api";

type SponsorData = {
  id: number;
  name: string;
  url: string;
  // Other properties of sponsor data
};

const SponsorDetail = () => {
  const { sponsorId } = useParams<string>(); // Extract sponsorId from the URL parameter
  const [sponsorData, setSponsorData] = useState<SponsorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch sponsor details when component mounts
    const fetchData = async () => {
      try {
        // Replace 'yourAuthToken' with the actual authentication token
        const token = "yourAuthToken";
        const data = await fetchSponsorById(Number(sponsorId), token);
        setSponsorData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sponsor details:", error);
      }
    };

    fetchData();
  }, [sponsorId]); // Include sponsorId in the dependency array

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sponsorData) {
    return <div>Error fetching sponsor details.</div>;
  }

  // Render the sponsor details here using sponsorData

  return (
    <div>
      <h2>Sponsor Details</h2>
      <p>Name: {sponsorData.name}</p>
      <p>URL: {sponsorData.url}</p>
      {/* Render other sponsor details here */}
    </div>
  );
};

export default SponsorDetail;

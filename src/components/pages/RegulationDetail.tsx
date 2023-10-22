import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRegulationDetails } from "../middleware/Api";
import { useAuth } from "../../contexts/AuthContext";

type RegulationDetailType = {
  id: number;
  name: string;
  description: string;
};

interface RegulationDetailProps {
  regulationId?: string;
}

const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulationId,
}) => {
  const { sponsorId } = useParams<{ sponsorId?: string }>();

  const [regulationDetails, setRegulationDetails] =
    useState<RegulationDetailType | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function getRegulationDetails() {
      try {
        console.log("Checking values: user.token", user?.token);
        console.log("Checking values: sponsorId", sponsorId);
        console.log("Checking values: regulationId", regulationId);
        if (user?.token && sponsorId && regulationId) {
          const details = await fetchRegulationDetails(
            user.token,
            sponsorId,
            regulationId,
          );
          setRegulationDetails(details);
        } else {
          console.error("Token, sponsorId, or regulationId is not available");
        }
      } catch (error) {
        console.error("Failed to fetch regulation details:", error);
      }
    }
    getRegulationDetails();
  }, [sponsorId, regulationId, user]);

  if (!regulationDetails) return <p>Loading...</p>;

  return (
    <div>
      <h1>{regulationDetails.name}</h1>
    </div>
  );
};

export default RegulationDetail;

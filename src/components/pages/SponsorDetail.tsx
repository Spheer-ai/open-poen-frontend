import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getFunderById } from "../middleware/Api";
import Breadcrumb from "../ui/layout/BreadCrumbs";
import styles from "../../assets/scss/pages/SponsorDetail.module.scss";

type SponsorData = {
  id: number;
  name: string;
  url: string;
};

const SponsorDetail = () => {
  const { funderId } = useParams();
  const [sponsorData, setSponsorData] = useState<SponsorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const token = user?.token || "";

  useEffect(() => {
    console.log("SponsorDetail component rendered");
    console.log("funderId in SponsorDetail:", funderId);
    console.log("Type of funderId in SponsorDetail:", typeof funderId);

    if (funderId) {
      const fetchData = async () => {
        try {
          const data = await getFunderById(token, parseInt(funderId, 10));
          setSponsorData(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching sponsor details:", error);
        }
      };

      fetchData();
    }
  }, [funderId, token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!sponsorData) {
    return <div>Error fetching sponsor details.</div>;
  }

  return (
    <div className={styles["sponsor-detail-container"]}>
      <Breadcrumb />
      <h2>Sponsor Details</h2>
      <p>Name: {sponsorData.name}</p>
      <p>URL: {sponsorData.url}</p>
    </div>
  );
};

export default SponsorDetail;

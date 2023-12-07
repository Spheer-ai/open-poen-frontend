import React, { useState, useEffect } from "react";
import {
  fetchLinkableActivities,
  linkActivityToPayment,
} from "../../../middleware/Api";

interface Activity {
  id: number;
  name: string;
}

interface LinkActivityToPaymentProps {
  token: string;
  paymentId: number;
  initiativeId: number;
}

const LinkActivityToPayment: React.FC<LinkActivityToPaymentProps> = ({
  token,
  paymentId,
  initiativeId,
}) => {
  const [linkableActivities, setLinkableActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isDropdownOpen) {
      const getLinkableActivitiesForPayment = async () => {
        try {
          setIsLoading(true);
          console.log("Fetching activities with token:", token);
          console.log("Payment ID:", paymentId);
          console.log("Initiative ID:", initiativeId);

          const activities: Activity[] = await fetchLinkableActivities(
            token,
            initiativeId,
          );

          console.log("Activities:", activities);
          setLinkableActivities(activities);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching linkable activities:", error);
          setIsLoading(false);
        }
      };

      getLinkableActivitiesForPayment();
    }
  }, [token, paymentId, initiativeId, isDropdownOpen]);

  const handleLinkActivityClick = () => {
    setIsDropdownOpen(true);
  };

  const handleLinkActivity = async () => {
    try {
      setIsLoading(true);
      await linkActivityToPayment(
        token,
        paymentId,
        initiativeId,
        selectedActivity,
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error linking activity to payment:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <span onClick={handleLinkActivityClick} style={{ cursor: "pointer" }}>
            {linkableActivities.length > 0
              ? isDropdownOpen
                ? "Close Dropdown"
                : "Link Activity"
              : "No Activities Available"}
          </span>
          {isDropdownOpen && (
            <div>
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(Number(e.target.value))}
              >
                <option value="">Select an activity</option>
                {linkableActivities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
              <button onClick={handleLinkActivity}>Link Activity</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkActivityToPayment;

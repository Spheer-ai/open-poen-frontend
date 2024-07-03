import { useState, useEffect, useCallback, useRef } from "react";
import { Activities } from "../../types/ActivitiesTypes";
import { fetchActivities } from "../middleware/Api";

const useActivities = (
  initiativeId: number | undefined,
  token: string | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [activities, setActivities] = useState<Activities[]>([]);
  const [initiativeName, setInitiativeName] = useState("");
  const [isActivitiesLoaded, setIsActivitiesLoaded] = useState(false);
  const hasFetchedActivities = useRef(false);

  const loadActivities = useCallback(async () => {
    console.log("loadActivities called");

    if (!initiativeId) {
      console.log("Skipping fetch: no initiativeId");
      setLoading(false);
      return;
    }
    if (hasFetchedActivities.current) {
      console.log("Skipping fetch: activities already fetched");
      return;
    }

    console.log("Fetching activities for initiativeId:", initiativeId);
    hasFetchedActivities.current = true;
    setLoading(true);

    try {
      const initiativeData = await fetchActivities(initiativeId, token ?? "");
      console.log("Fetched initiative data:", initiativeData);

      const updatedActivities = initiativeData.activities || [];
      setInitiativeName(initiativeData.name);

      const activitiesWithInitiativeNames = updatedActivities.map(
        (activity) => ({
          ...activity,
          initiativeName: initiativeData.name,
          beschikbaar: Math.max(activity.budget + activity.expenses, 0),
        }),
      );

      console.log(
        "Updated activities with initiative names:",
        activitiesWithInitiativeNames,
      );

      setActivities(activitiesWithInitiativeNames);
      setIsActivitiesLoaded(true);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
      console.log("Finished loading activities");
    }
  }, [initiativeId, token, setLoading]);

  useEffect(() => {
    console.log("useEffect triggered for loadActivities");
    loadActivities();
  }, [loadActivities]);

  return { activities, initiativeName, isActivitiesLoaded, loadActivities };
};

export default useActivities;

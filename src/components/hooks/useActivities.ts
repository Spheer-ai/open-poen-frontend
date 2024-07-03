import { useState, useEffect, useCallback, useRef } from "react";
import { Activities } from "../../types/ActivitiesTypes";
import { fetchActivities } from "../middleware/Api";

const useActivities = (
  initiativeId: number | undefined,
  token: string | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [activities, setActivities] = useState<Activities[]>([]);
  const [initiativeData, setInitiativeData] = useState<any>(null);
  const [initiativeName, setInitiativeName] = useState<string>("");
  const [isActivitiesLoaded, setIsActivitiesLoaded] = useState(false);
  const hasFetchedActivities = useRef(false);

  const loadActivities = useCallback(async () => {
    if (!initiativeId) {
      setLoading(false);
      return;
    }
    if (hasFetchedActivities.current) {
      return;
    }

    hasFetchedActivities.current = true;
    setLoading(true);

    try {
      const fetchedInitiativeData = await fetchActivities(
        initiativeId,
        token ?? "",
      );
      const updatedActivities = fetchedInitiativeData.activities || [];

      setInitiativeName(fetchedInitiativeData.name);
      setInitiativeData(fetchedInitiativeData);

      const activitiesWithInitiativeNames = updatedActivities.map(
        (activity) => ({
          ...activity,
          initiativeName: fetchedInitiativeData.name,
          beschikbaar: Math.max(activity.budget + activity.expenses, 0),
        }),
      );

      setActivities(activitiesWithInitiativeNames);
      setIsActivitiesLoaded(true);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }, [initiativeId, token, setLoading]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    initiativeData,
    initiativeName,
    isActivitiesLoaded,
    loadActivities,
  };
};

export default useActivities;

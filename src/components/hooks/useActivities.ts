import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  const activitiesRef = useRef<Activities[]>([]);
  const initiativeDataRef = useRef<any>(null);
  const initiativeNameRef = useRef<string>("");
  const isLoadedRef = useRef(false);

  const loadActivities = useCallback(async () => {
    if (!initiativeId || isLoadedRef.current) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const fetchedInitiativeData = await fetchActivities(
        initiativeId,
        token ?? "",
      );
      let updatedActivities = fetchedInitiativeData.activities || [];

      updatedActivities = updatedActivities.sort((a, b) => b.id - a.id);

      activitiesRef.current = updatedActivities.map((activity) => ({
        ...activity,
        initiativeName: fetchedInitiativeData.name,
        beschikbaar: Math.max(activity.budget + activity.expenses, 0),
      }));
      initiativeDataRef.current = fetchedInitiativeData;
      initiativeNameRef.current = fetchedInitiativeData.name;
      isLoadedRef.current = true;

      setActivities(activitiesRef.current);
      setInitiativeData(initiativeDataRef.current);
      setInitiativeName(initiativeNameRef.current);
      setIsActivitiesLoaded(true);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }, [initiativeId, token, setLoading]);

  const addActivityToList = (newActivity: Activities) => {
    activitiesRef.current = [newActivity, ...activitiesRef.current].sort(
      (a, b) => b.id - a.id,
    );
    setActivities([...activitiesRef.current]);
    console.log("Activity added:", newActivity);
    console.log("Updated activities list:", activitiesRef.current);
  };

  const updateActivityInList = (updatedActivity: Activities) => {
    activitiesRef.current = activitiesRef.current.map((activity) =>
      activity.id === updatedActivity.id
        ? { ...activity, ...updatedActivity }
        : activity,
    );
    setActivities([...activitiesRef.current]);
    console.log("Activity updated:", updatedActivity);
    console.log("Updated activities list:", activitiesRef.current);
  };

  const removeActivityFromList = (activityId: string) => {
    activitiesRef.current = activitiesRef.current.filter(
      (activity) => activity.id !== parseInt(activityId),
    );
    setActivities([...activitiesRef.current]);
    console.log("Activity removed:", activityId);
    console.log("Updated activities list:", activitiesRef.current);
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    initiativeData,
    initiativeName,
    isActivitiesLoaded,
    loadActivities,
    addActivityToList,
    updateActivityInList,
    removeActivityFromList,
  };
};

export default useActivities;

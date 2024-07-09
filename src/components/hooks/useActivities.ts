import { useState, useEffect, useCallback, useRef } from "react";
import { Activities, InitiativeData } from "../../types/ActivitiesTypes";
import { fetchActivities } from "../middleware/Api";

const useActivities = (
  initiativeId: number | undefined,
  token: string | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [activities, setActivities] = useState<Activities[]>([]);
  const [initiativeData, setInitiativeData] = useState<InitiativeData | null>(
    null,
  );
  const [initiativeName, setInitiativeName] = useState<string>("");
  const [isActivitiesLoaded, setIsActivitiesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const activitiesRef = useRef<Activities[]>([]);
  const initiativeDataRef = useRef<InitiativeData | null>(null);
  const initiativeNameRef = useRef<string>("");
  const isLoadedRef = useRef(false);

  const loadActivities = useCallback(async () => {
    if (!initiativeId || isLoadedRef.current) {
      setLoading(false);
      setIsLoading(false);
      return;
    }

    setLoading(true);
    setIsLoading(true);

    try {
      const fetchedInitiativeData = await fetchActivities(
        initiativeId,
        token ?? "",
      );
      let updatedActivities = fetchedInitiativeData.activities || [];

      updatedActivities = updatedActivities.sort((a, b) => b.id - a.id);

      activitiesRef.current = updatedActivities.map((activity) => ({
        ...activity,
        initiativeId,
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
      setIsLoading(false);
    }
  }, [initiativeId, token, setLoading]);

  const addActivityToList = (newActivity: Activities) => {
    activitiesRef.current = [newActivity, ...activitiesRef.current].sort(
      (a, b) => b.id - a.id,
    );
    setActivities([...activitiesRef.current]);
  };

  const updateActivityInList = (updatedActivity: Activities) => {
    activitiesRef.current = activitiesRef.current.map((activity) =>
      activity.id === updatedActivity.id
        ? { ...activity, ...updatedActivity }
        : activity,
    );
    setActivities([...activitiesRef.current]);
  };

  const removeActivityFromList = (activityId: string) => {
    activitiesRef.current = activitiesRef.current.filter(
      (activity) => activity.id !== parseInt(activityId),
    );
    setActivities([...activitiesRef.current]);
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
    isLoading,
  };
};

export default useActivities;

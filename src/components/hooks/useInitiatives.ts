import { useState, useEffect, useCallback, useRef } from "react";
import { Initiative } from "../../types/InitiativesTypes";
import { fetchInitiatives } from "../middleware/Api";

const useInitiatives = (
  token: string | undefined,
  limit: number,
  onlyMine: boolean,
) => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingMoreInitiatives, setIsLoadingMoreInitiatives] =
    useState(false);
  const [hasMoreInitiatives, setHasMoreInitiatives] = useState(true);
  const initialFetchDoneRef = useRef(false);

  const fetchAndDisplayInitiatives = useCallback(
    async (offset: number, limit: number) => {
      console.log(
        `Fetching initiatives: offset=${offset}, limit=${limit}, onlyMine=${onlyMine}`,
      );
      setIsLoadingMoreInitiatives(true);
      try {
        const initiativesData = await fetchInitiatives(
          token || "",
          onlyMine,
          offset,
          limit,
        );
        if (initiativesData.length < limit) {
          setHasMoreInitiatives(false);
        }

        const initiativesWithBeschikbaar = initiativesData.map((initiative) => {
          const beschikbaar = Math.max(
            initiative.budget + initiative.expenses,
            0,
          );
          return { ...initiative, beschikbaar };
        });

        setInitiatives((prevInitiatives) => [
          ...prevInitiatives,
          ...initiativesWithBeschikbaar,
        ]);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      } finally {
        setIsLoadingMoreInitiatives(false);
      }
    },
    [token, onlyMine],
  );

  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      console.log("Initial fetch of initiatives");
      fetchAndDisplayInitiatives(0, limit);
      initialFetchDoneRef.current = true;
    }
  }, [fetchAndDisplayInitiatives, limit]);

  useEffect(() => {
    console.log("Fetching initiatives due to onlyMine or limit change");
    setOffset(0);
    setInitiatives([]);
    setHasMoreInitiatives(true);
    fetchAndDisplayInitiatives(0, limit);
  }, [onlyMine, fetchAndDisplayInitiatives, limit]);

  const loadMoreInitiatives = useCallback(() => {
    if (hasMoreInitiatives && !isLoadingMoreInitiatives) {
      const newOffset = offset + limit;
      console.log(`Loading more initiatives: newOffset=${newOffset}`);
      setOffset(newOffset);
      fetchAndDisplayInitiatives(newOffset, limit);
    }
  }, [
    offset,
    limit,
    fetchAndDisplayInitiatives,
    hasMoreInitiatives,
    isLoadingMoreInitiatives,
  ]);

  const resetInitiatives = useCallback(() => {
    console.log("Resetting initiatives");
    setOffset(0);
    setInitiatives([]);
    setHasMoreInitiatives(true);
  }, []);

  return {
    initiatives,
    isLoadingMoreInitiatives,
    loadMoreInitiatives,
    resetInitiatives,
    hasMoreInitiatives,
    fetchAndDisplayInitiatives,
  };
};

export default useInitiatives;

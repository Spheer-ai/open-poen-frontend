import { useState, useEffect, useCallback } from "react";
import { Initiative } from "../../types/InitiativesTypes";
import { fetchInitiatives } from "../middleware/Api";

const useInitiatives = (
  token: string | undefined,
  limit: number,
  onlyMine: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingMoreInitiatives, setIsLoadingMoreInitiatives] =
    useState(false);
  const [hasMoreInitiatives, setHasMoreInitiatives] = useState(true);

  const fetchAndDisplayInitiatives = useCallback(
    async (offset: number, limit: number, reset: boolean = false) => {
      console.log(
        `Fetching initiatives: offset=${offset}, limit=${limit}, onlyMine=${onlyMine}`,
      );
      if (!reset) {
        setIsLoadingMoreInitiatives(true);
      }
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

        if (reset) {
          setInitiatives(initiativesWithBeschikbaar);
        } else {
          setInitiatives((prevInitiatives) => [
            ...prevInitiatives,
            ...initiativesWithBeschikbaar,
          ]);
        }
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      } finally {
        if (!reset) {
          setIsLoadingMoreInitiatives(false);
        }
        setLoading(false);
      }
    },
    [token, onlyMine, setLoading],
  );

  useEffect(() => {
    setLoading(true);
    fetchAndDisplayInitiatives(0, limit, true);
  }, [fetchAndDisplayInitiatives, limit, onlyMine, setLoading]);

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

  return {
    initiatives,
    isLoadingMoreInitiatives,
    loadMoreInitiatives,
    hasMoreInitiatives,
  };
};

export default useInitiatives;

// src/hooks/useActivities.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getActivitiesLists } from "../api/activities";

export function useActivities(page) {
  return useQuery({
    queryKey: ["activities", page],
    queryFn: () => getActivitiesLists({ page }),
    staleTime: 30 * 60 * 1000,      // 30 min
    gcTime: 2 * 60 * 60 * 1000,
    placeholderData: keepPreviousData,
    select: (payload) => ({
      rows: payload?.data ?? [],
      meta: {
        total: payload?.total ?? 0,
        page: payload?.page ?? 1,
        perPage: payload?.perPage ?? 20,
        totalPages: payload?.totalPages ?? 1,
      },
    }),
  });
}

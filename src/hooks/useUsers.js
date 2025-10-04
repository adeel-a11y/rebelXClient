// src/hooks/useUsers.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsersLists } from "../api/users";

export function useUsers(page) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsersLists({ page }),
    staleTime: 30 * 60 * 1000,          // 30 min
    gcTime: 2 * 60 * 60 * 1000,
    placeholderData: keepPreviousData,  // page switch pe previous rows dikhe
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

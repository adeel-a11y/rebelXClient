import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getClientsLists } from "../api/clients";

export function useClients(page) {
  return useQuery({
    queryKey: ["clients", page],
    queryFn: () => getClientsLists({ page }),
    staleTime: 30 * 60 * 1000,
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

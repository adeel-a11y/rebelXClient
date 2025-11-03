// src/hooks/useLookups.js
import { useQuery } from "@tanstack/react-query";
import { getClientsNames, getUsersNames } from "../api/lookup";
import { getClientOrdersStats } from "../api/analytics";

const qk = {
  clientNames: (q, limit) => ["lookups", "clients", "names", q || "", limit || 1000],
  userNames:   (q, limit) => ["lookups", "users", "names", q || "", limit || 1000],
};

export function useClientNames(q = "", limit = 1000, enabled = true) {
  return useQuery({
    queryKey: qk.clientNames(q, limit),
    queryFn: () => getClientsNames(q, limit),
    enabled,
    staleTime: 60_000,
  });
}

export function useUserNames(q = "", limit = 1000, enabled = true) {
  return useQuery({
    queryKey: qk.userNames(q, limit),
    queryFn: () => getUsersNames(q, limit),
    enabled,
    staleTime: 60_000,
  });
}

export function useClientOrdersStats(externalId = "", enabled = true) {
    return useQuery({
        queryKey: ["clientOrders", externalId],
        queryFn: () => getClientOrdersStats(externalId),
        enabled,
        staleTime: 60_000,
    });
}

// ---- src/hooks/useClients.js ----
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getClientsLists, getClientsSummary, getClientById, createClient, updateClient, updateClientStatus, deleteClient } from "../api/clients";

export function useClients(page = 1, q = "", pageSize = 100, filters = { statuses: [], states: [] }) {
  return useQuery({
    queryKey: ["clients.lists", page, q, pageSize, filters],
    queryFn: async () => {
      const res = await getClientsLists({ page, q, limit: pageSize, filters });

      // normalize
      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res?.rows) ? res.rows : [];
      const total = Number.isFinite(res?.total) ? res.total : res?.meta?.total ?? 0;

      return {
        rows,
        meta: {
          total,
          page: res?.page ?? page,
          perPage: res?.perPage ?? pageSize,
          totalPages: res?.totalPages ?? Math.max(Math.ceil(total / (res?.perPage ?? pageSize)), 1),
        },
        raw: res,
      };
    },
    keepPreviousData: true,
    staleTime: 30_000,
  });
}

export function useClientsSummary() {
  return useQuery({
    queryKey: ["clients-summary"],
    queryFn: getClientsSummary,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

/** Fetch one client */
export function useClient(id) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => getClientById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

/** Create */
export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createClient(payload),
    onSuccess: (created) => {
      // invalidate lists and summary
      qc.invalidateQueries({ queryKey: ["clients.lists"] });
      qc.invalidateQueries({ queryKey: ["clients.summary"] });
    },
  });
}

/** Update */
export function useUpdateClient(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateClient(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["clients.lists"] });
      qc.invalidateQueries({ queryKey: ["clients.summary"] });
      qc.invalidateQueries({ queryKey: ["client", id] });
    },
  });
}
export function useUpdateStatusClient(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateClientStatus(id, payload),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["clients.lists"] });
      qc.invalidateQueries({ queryKey: ["clients.summary"] });
      qc.invalidateQueries({ queryKey: ["client", id] });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteClient(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clients.lists"] });
      qc.invalidateQueries({ queryKey: ["clients.summary"] });
    },
  });
}
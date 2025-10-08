// src/hooks/useActivities.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActivitiesLists,
  getActivitiesSummary,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../api/activities";

/** QueryKey factory (stable & easy to invalidate) */
const qk = {
  base: "activities",
  list: (params) => [ "activities", "list", params ],
  byId: (id) => [ "activities", "byId", id ],
  summary: (params) => ["activities", "summary", params],
};

export function useActivities(
  page = 1,
  q = "",
  limit = 20,
  filters = {},
  options = {}
) {
  const params = {
    page,
    limit,
    q,
    filters,
    ...options, // from, to, sortBy, sort
  };

  return useQuery({
    queryKey: qk.list(params),
    queryFn: () => getActivitiesLists(params),
    keepPreviousData: true,
  });
}

/** Single activity (detail) */
export function useActivity(id, enabled = true) {
  return useQuery({
    queryKey: qk.byId(id),
    queryFn: () => getActivityById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useActivitiesSummary({ q = "", datePreset = null, from, to } = {}) {
  const params = { q, datePreset, from, to };
  return useQuery({
    queryKey: qk.summary(params),
    queryFn: () => getActivitiesSummary(params),
    staleTime: 30_000,
  });
}

/** CREATE */
export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createActivity(payload),
    onSuccess: () => {
      // refetch all list variants
      qc.invalidateQueries({ queryKey: [ "activities", "list" ] });
    },
  });
}

/** UPDATE */
export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateActivity(id, payload),
    onSuccess: (data) => {
      // update detail cache if present
      const id = data?._id;
      if (id) qc.setQueryData(qk.byId(id), data);
      qc.invalidateQueries({ queryKey: [ "activities", "list" ] });
    },
  });
}

/** DELETE */
export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteActivity(id),
    onSuccess: (_data, id) => {
      // clear detail cache for the deleted id
      if (id) qc.removeQueries({ queryKey: qk.byId(id) });
      qc.invalidateQueries({ queryKey: [ "activities", "list" ] });
    },
  });
}

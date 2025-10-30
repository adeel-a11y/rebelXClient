// src/hooks/useUsers.js
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getUsersLists, getUsersSummary, createUser, getUserById, updateUser, deleteUser, getUserNames } from "../api/users";

export function useUsers(page, q = "", pageSize = 20, filters = {}) {
  // Stable key: stringify filters shallowly
  const fkey = JSON.stringify({
    statuses: Array.isArray(filters.statuses) ? filters.statuses.slice().sort() : [],
    roles: Array.isArray(filters.roles) ? filters.roles.slice().sort() : [],
  });

  return useQuery({
    queryKey: ["users", page, q, pageSize, fkey],
    queryFn: () => getUsersLists({ page, q, limit: pageSize, filters }),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
    select: (payload) => ({
      rows: payload?.data ?? [],
      meta: {
        total: payload?.total ?? 0,
        page: payload?.page ?? 1,
        perPage: payload?.perPage ?? pageSize,
        totalPages: payload?.totalPages ?? 1,
      },
    }),
  });
}

export function useUserNames() {
  return useQuery({
    queryKey: ["user-names"],
    queryFn: getUserNames,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 60 * 60 * 1000,    // 1 hr
    select: (payload) => payload?.data ?? [],
    placeholderData: keepPreviousData,
  });
}

export function useUsersSummary() {
  return useQuery({
    queryKey: ["users-summary"],
    queryFn: getUsersSummary,
    staleTime: 10 * 60 * 1000, // 10 min
    gcTime: 60 * 60 * 1000,    // 1 hr
    select: (payload) => ({
      total: payload?.total ?? 0,
      active: payload?.active ?? 0,
      inactive: payload?.inactive ?? 0,
      byStatus: payload?.byStatus ?? [],
      byRole: payload?.byRole ?? [],
      generatedAt: payload?.generatedAt,
    }),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // list + summary refresh
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["users-summary"] });
    },
  });
}

export function useUser(id) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    select: (p) => p?.data, // keep only doc
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["users-summary"] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      // list + summary refresh
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["users-summary"] });
    },
  });
}
// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersLists, getOrderById, createOrder, updateOrder, deleteOrder } from "../api/orders";

/** (already provided earlier) */
export function useOrdersLists({
  page = 1,
  limit = 100,
  q = "",
  statuses = [],
  datePreset = null,
  from,
  to,
  queryOptions = {},
} = {}) {
  return useQuery({
    queryKey: ["orders", { page, limit, q, statuses, datePreset, from, to }],
    queryFn: ({ signal }) =>
      getOrdersLists({ page, limit, q, statuses, datePreset, from, to, signal }),
    staleTime: 600_000,
    gcTime: 600_000,
    keepPreviousData: true,
    ...queryOptions,
  });
}

export function useOrderById(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
<<<<<<< HEAD
    staleTime: 600_000,
=======
    staleTime: 30_000,
>>>>>>> origin/main
  });
}

/** CREATE */
export function useCreateOrder({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (data, variables, ctx) => {
      // invalidate listing and optionally first page
      qc.invalidateQueries({ queryKey: ["orders"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

/** UPDATE */
export function useUpdateOrder({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateOrder(id, payload),
    onSuccess: (data, variables, ctx) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

/** DELETE */
export function useDeleteOrder({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: (data, variables, ctx) => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

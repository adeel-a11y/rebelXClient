// src/hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersLists, getOrderById, createOrder, updateOrder, deleteOrder, getClientOrdersLists, getOrdersSummary } from "../api/orders";
import { createOrderItem, deleteOrderItem, getOrderItemById, updateOrderItem } from "../api/orderItem";

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

export function useClientOrdersLists(externalId, {
  page = 1,
  limit = 10,
  q = "",
  statuses = [],
  datePreset = null,
  from,
  to,
  queryOptions = {},
} = {}) {
  return useQuery({
    queryKey: ["orders", externalId, { page, limit, q, statuses, datePreset, from, to }],
    queryFn: ({ signal }) =>
      getClientOrdersLists(externalId, { page, limit, q, statuses, datePreset, from, to, signal }),
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
    staleTime: 600_000,
  });
}

export function useOrdersSummary(externalId = "") {
  const hasId = externalId;
  return useQuery({
    queryKey: ["orders-summary", hasId ? externalId : null], // id change → refetch
    queryFn: () => getOrdersSummary(hasId ? externalId : undefined),
    staleTime: 600_000,
  });
}

export function useOrderItemById(id) {
  return useQuery({
    queryKey: ["orderItem", id],
    queryFn: () => getOrderItemById(id),
    enabled: !!id,
    staleTime: 600_000,
  });
}

/** CREATE */
export function useCreateOrder({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createOrder(payload),
    onSuccess: (data, variables, ctx) => {
      // invalidate listing and optionally first page
      qc.invalidateQueries({ queryKey: ["orders", "orders-summary"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

export function useCreateOrderItem({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createOrderItem(payload),
    onSuccess: (data, variables, ctx) => {
      // invalidate listing and optionally first page
      qc.invalidateQueries({ queryKey: ["order"] });
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
      qc.invalidateQueries({ queryKey: ["orders", "orders-summary"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

export function useUpdateOrderItem({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateOrderItem(id, payload),
    onSuccess: (data, variables, ctx) => {
      qc.invalidateQueries({ queryKey: ["order"] });
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
      qc.invalidateQueries({ queryKey: ["orders", "orders-summary"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

export function useDeleteOrderItem({ onSuccess, onError } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteOrderItem(id),
    onSuccess: (data, variables, ctx) => {
      qc.invalidateQueries({ queryKey: ["order"] });
      onSuccess?.(data, variables, ctx);
    },
    onError,
  });
}

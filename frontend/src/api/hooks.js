
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

/* ================= PRODUCTS ================= */
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });
}

/* ================= CART ================= */
export function useCart() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data;
    },
    enabled: !!token && role === "customer",
  });
}

/* ================= ADD TO CART ================= */
export function useAddToCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ product_id, quantity }) => {
      const res = await api.post("/cart", {
        product_id,
        quantity,
      });
      return res.data; // ✅ inside function (correct)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ================= UPDATE CART ================= */
export function useUpdateCartQty() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ cart_item_id, quantity }) => {
      const res = await api.patch(`/cart/${cart_item_id}`, {
        quantity,
      });
      return res.data;
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

/* ================= CHECKOUT ================= */
export function useCheckout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/orders/checkout");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}


export function useMyOrders() {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await api.get("/orders/my-orders");
      return res.data;
    },
  });
}

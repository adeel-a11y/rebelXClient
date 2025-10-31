import React from "react";
import OrderDetail from "../components/details/Orders/OrderDetail";
import { useToolbar } from "../store/toolbar";
import { useOrderById } from "../hooks/useOrders";
import { useParams } from "react-router-dom";

const OrderDetailPage = () => {
  // toolbar
  useToolbar({
    title: "Order Details",
    searchPlaceholder: "",
    backButton: true,
  });

  const { id } = useParams();

  const { data, isLoading } = useOrderById(id);
  console.log("order detail", data)

  return (
    <>
      <OrderDetail order={data} loading={isLoading} />
    </>
  );
};

export default OrderDetailPage;

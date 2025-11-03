import React, { useEffect, useState } from "react";
import CreateOrEditOrderDetail from "../components/details/Orders/CreateOrEditOrderDetail";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useOrderItemById } from "../hooks/useOrders";

const EditOrderItem = () => {
  const navigate = useNavigate();

  useToolbar({
    title: "Edit Order Item",
    searchPlaceholder: "",
    backButton: true,
  });
  const { id } = useParams();
  const { data: orderItem } = useOrderItemById(id);

  useEffect(() => {
    if (!id) return;
    console.log("order Item", orderItem);
  }, [id]);

  return (
    <>
      <CreateOrEditOrderDetail
        mode="edit"
        initial={orderItem}
        onDone={() => /* toast + navigate */ null}
      />
    </>
  );
};

export default EditOrderItem;

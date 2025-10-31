import React, { useState } from "react";
import CreateOrEditOrder from "../components/orders/CreateOrEditOrder";
import { useParams } from "react-router-dom";
import { useOrderById } from "../hooks/useOrders";
import { useToolbar } from "../store/toolbar";
import { useNavigate } from "react-router-dom";

const EditOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useOrderById(id);

  useToolbar({
    title: "Edit Order",
    searchPlaceholder: "",
    actions: [
      { label: "Back", variant: "ghost", onClick: () => navigate("/orders") },
    ],
    backButton: true,
  });

  return (
    <>
      <CreateOrEditOrder
        mode="edit"
        initial={data} // must include _id for update
        onDone={() => /* toast + navigate */ null}
      />
    </>
  );
};

export default EditOrderPage;

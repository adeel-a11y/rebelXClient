import React, { useState } from 'react'
import CreateOrEditOrder from "../components/orders/CreateOrEditOrder";
import { useParams } from 'react-router-dom';
import { useOrderById } from '../hooks/useOrders';

const EditOrderPage = () => {

    const { id } = useParams();

    const { data, isLoading } = useOrderById(id);

    return (
        <>
            <CreateOrEditOrder
                mode="edit"
                initial={data}   // must include _id for update
                onDone={() => /* toast + navigate */ null}
            />
        </>
    )
}

export default EditOrderPage

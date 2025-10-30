import React from 'react'
import CreateOrEditOrder from "../components/orders/CreateOrEditOrder";

const CreateOrder = () => {
    return (
        <>
            <CreateOrEditOrder
                mode="create"
                onDone={() => /* toast + navigate */ null}
            />
        </>
    )
}

export default CreateOrder

export type UpdateProductRequestBody = {
    name: string,
    wholesalePrice: string | number,
    retailPrice: string | number,
    category: string,
    marketId: string | number,
    isByWeight: boolean
}

export type UpdateOrderRequestBody = {
    date: Date | string,
    orderItems: OrderItemsRequestBody[]
    status: string,
    address: {
        city: string,
        street: string,
        building: string
    }
}
export type UpdateShipmentRequestBody = {
    date: Date | string,
    shipmentItems: ShipmentItemsRequestBody[]
    status: string,
}

export type OrderItemsRequestBody = {
    id: string
    amount: number
}

export type ShipmentItemsRequestBody = {
    id: string
    amount: number
}
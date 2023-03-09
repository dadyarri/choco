import {Product} from "./types";

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
    status: string | undefined,
    address: {
        city: string,
        street: string,
        building: string
    }
}
export type UpdateShipmentRequestBody = {
    date: Date | string,
    shipmentItems: ShipmentItemsRequestBody[]
    status: string | undefined,
}

export type OrderItemsRequestBody = {
    id: string
    amount: number
}

export type ShipmentItemsRequestBody = {
    id: string
    amount: number
}

export type InventoryRequestBody = {
    products: Product[] | undefined
}

export type UpdateProductCategoryRequestBody = {
    name: string
}
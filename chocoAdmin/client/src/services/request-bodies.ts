import {OrderItem} from "./types";

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
    orderItems: OrderItem[]
    status: string,
    address: {
        city: string,
        street: string,
        building: string
    }
}
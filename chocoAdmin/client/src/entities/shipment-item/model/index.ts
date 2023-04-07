import {Product} from "entities/product";

export type ShipmentItem = {
    id: string
    product: Product
    amount: number
}
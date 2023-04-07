import {Product} from "entities/product";

export type OrderItem = {
    id: string
    product: Product
    amount: number
}

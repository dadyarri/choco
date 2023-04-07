import {OrderStatus} from "entities/order-status";
import {OrderItem} from "entities/order-item";
import {OrderAddress} from "entities/order-address";

export type Order = {
    id: string
    date: Date
    status: OrderStatus
    orderItems: OrderItem[]
    address: OrderAddress
    deleted: boolean
}

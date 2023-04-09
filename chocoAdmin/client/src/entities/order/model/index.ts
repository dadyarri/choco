import { OrderAddress } from "entities/order-address";
import { OrderItem } from "entities/order-item";
import { OrderStatus } from "entities/order-status";

export type Order = {
    id: string;
    date: Date;
    status: OrderStatus;
    orderItems: OrderItem[];
    address: OrderAddress;
    deleted: boolean;
};

import {OrderCity} from "entities/order-city";

export type OrderAddress = {
    id: string
    city: OrderCity
    street: string
    building: string
}

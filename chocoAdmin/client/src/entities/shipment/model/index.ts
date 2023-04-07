import {ShipmentStatus} from "entities/shipment-status";
import {ShipmentItem} from "entities/shipment-item";

export type Shipment = {
    id: string
    date: Date
    status: ShipmentStatus
    shipmentItems: ShipmentItem[]
    deleted: boolean
}

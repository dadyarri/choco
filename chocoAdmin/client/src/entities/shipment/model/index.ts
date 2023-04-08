import {ShipmentItem} from "entities/shipment-item";
import {ShipmentStatus} from "entities/shipment-status";

export type Shipment = {
    id: string
    date: Date
    status: ShipmentStatus
    shipmentItems: ShipmentItem[]
    deleted: boolean
}

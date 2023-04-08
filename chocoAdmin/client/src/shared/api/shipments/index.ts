import { Shipment } from "entities";
import { UpdateShipmentRequestBody } from "services/request-bodies";
import { ModelApi } from "shared/api/lib";

export class ShipmentsApi extends ModelApi<Shipment, UpdateShipmentRequestBody> {
    protected override baseURL = "/shipments";
}

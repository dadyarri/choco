import { ShipmentStatus } from "entities";
import { ModelApi } from "shared/api/lib";

export class ShipmentStatusesApi extends ModelApi<ShipmentStatus, unknown> {
    protected override baseURL = "/shipmentStatuses";
}

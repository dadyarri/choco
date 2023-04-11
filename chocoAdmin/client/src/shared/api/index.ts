import { AuthApi } from "./auth";
import { InventoryApi } from "./inventory";
import { OrderCitiesApi } from "./order-cities";
import { OrderStatusesApi } from "./order-statuses";
import { OrdersApi } from "./orders";
import { ProductCategoriesApi } from "./product-categories";
import { ProductsApi } from "./products";
import { ShipmentStatusesApi } from "./shipment-statuses";
import { ShipmentsApi } from "./shipments";
import { StatsApi } from "./stats";
import { VkApi } from "./vk";

const auth = new AuthApi();
const inventory = new InventoryApi();
const orderCities = new OrderCitiesApi();
const orderStatuses = new OrderStatusesApi();
const orders = new OrdersApi();
const productCategories = new ProductCategoriesApi();
const products = new ProductsApi();
const shipmentStatuses = new ShipmentStatusesApi();
const shipments = new ShipmentsApi();
const stats = new StatsApi();
const vk = new VkApi();

export {
    auth,
    inventory,
    orderCities,
    orderStatuses,
    orders,
    productCategories,
    products,
    shipmentStatuses,
    shipments,
    stats,
    vk,
};

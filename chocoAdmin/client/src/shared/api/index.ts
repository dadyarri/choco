import { InventoryApi } from "./inventory";
import { OrderCitiesApi } from "./order-cities";
import { OrdersApi } from "./orders";
import { ProductCategoriesApi } from "./product-categories";
import { ProductsApi } from "./products";
import { ShipmentsApi } from "./shipments";
import { StatsApi } from "./stats";
import { VkApi } from "./vk";

const inventory = new InventoryApi();
const orderCities = new OrderCitiesApi();
const orders = new OrdersApi();
const productCategories = new ProductCategoriesApi();
const products = new ProductsApi();
const shipments = new ShipmentsApi();
const stats = new StatsApi();
const vk = new VkApi();

export { inventory, orderCities, orders, productCategories, products, shipments, stats, vk };

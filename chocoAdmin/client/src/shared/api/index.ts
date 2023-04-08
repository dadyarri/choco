import { OrdersApi } from "./orders";
import { ProductsApi } from "./products";
const orders = new OrdersApi();
const products = new ProductsApi();

export { products, orders };
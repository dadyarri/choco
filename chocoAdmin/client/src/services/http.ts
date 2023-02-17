import Headers from "./http.specs";
import axios, {AxiosResponse} from "axios";
import {
    InventoryRequestBody,
    UpdateOrderRequestBody,
    UpdateProductRequestBody,
    UpdateShipmentRequestBody
} from "./request-bodies";
import {getToken} from "./jwt";

class HttpService {
    private static getHeaders(): Headers {
        const token = getToken();
        return {Authorization: `Bearer ${token}`};
    }

    public static async getProductById(productId: string): Promise<AxiosResponse> {
        return await axios.get(
            `/api/products/${productId}`,
            {headers: this.getHeaders()}
        )
    }

    public static async getProducts(): Promise<AxiosResponse> {
        return await axios.get(
            "/api/products",
            {headers: this.getHeaders()}
        )
    }

    public static deleteProduct(itemId: string): Promise<AxiosResponse> {
        return axios.delete(
            `/api/products/${itemId}`,
            {headers: this.getHeaders()}
        )
    }

    public static updateProduct(itemId: string, body: UpdateProductRequestBody): Promise<AxiosResponse> {
        return axios.patch(
            `/api/products/${itemId}`,
            body,
            {headers: this.getHeaders()}
        )
    }

    public static getMarketUrl(marketId: number) {
        return axios.get(
            `/api/vk/productUrl/${marketId}`,
            {headers: this.getHeaders()}
        )
    }

    static getProductCategories() {
        return axios.get(
            `/api/productCategories`,
            {headers: this.getHeaders()}
        )
    }

    static createProduct(body: UpdateProductRequestBody) {
        return axios.post(
            "/api/products",
            body,
            {headers: this.getHeaders()}
        )
    }

    static getOrders() {
        return axios.get(
            "/api/orders",
            {headers: this.getHeaders()}
        )
    }

    static getOrderStatuses() {
        return axios.get(
            "/api/orderstatuses",
            {headers: this.getHeaders()}
        )
    }

    static getOrderById(orderId: string) {
        return axios.get(
            `/api/orders/${orderId}`,
            {headers: this.getHeaders()}
        )
    }

    static updateOrder(orderId: string, values: UpdateOrderRequestBody) {
        return axios.patch(
            `/api/orders/${orderId}`,
            values,
            {headers: this.getHeaders()}
        )
    }

    static createOrder(values: UpdateOrderRequestBody) {
        return axios.post(
            "/api/orders",
            values,
            {headers: this.getHeaders()}
        )
    }

    static deleteOrder(orderId: string) {
        return axios.delete(
            `/api/orders/${orderId}`,
            {headers: this.getHeaders()}
        )
    }

    static getOrderCities() {
        return axios.get(
            "/api/ordercities",
            {headers: this.getHeaders()}
        )
    }

    static restoreOrderFromDeleted(orderId: string) {
        return axios.put(
            `/api/orders/${orderId}`,
            {headers: this.getHeaders()}
        )
    }

    static getStatsByCity() {
        return axios.get(
            "/api/Stats/ByCity",
            {headers: this.getHeaders()}
        );
    }

    static getTopProducts() {
        return axios.get(
            "/api/Stats/TopProducts",
            {headers: this.getHeaders()}
        );
    }

    static getIncomesInfo(months: number) {
        return axios.get(
            `/api/Stats/TotalIncomes/${months}`,
            {headers: this.getHeaders()}
        );
    }

    static getStatsByCategory() {
        return axios.get(
            `/api/Stats/Categories`,
            {headers: this.getHeaders()}
        );
    }

    static getShipments() {
        return axios.get(
            "/api/shipments",
            {headers: this.getHeaders()}
        )
    }

    static getShipmentById(shipmentId: string) {
        return axios.get(
            `/api/shipments/${shipmentId}`,
            {headers: this.getHeaders()}
        )
    }

    static getShipmentStatuses() {
        return axios.get(
            "/api/shipmentstatuses",
            {headers: this.getHeaders()}
        )
    }

    static updateShipment(shipmentId: string, values: UpdateShipmentRequestBody) {
        return axios.patch(
            `/api/shipments/${shipmentId}`,
            values,
            {headers: this.getHeaders()}
        )
    }

    static createShipment(values: UpdateShipmentRequestBody) {
        return axios.post(
            "/api/shipments",
            values,
            {headers: this.getHeaders()}
        )
    }

    static deleteShipment(shipmentId: string) {
        return axios.delete(
            `/api/shipments/${shipmentId}`,
            {headers: this.getHeaders()}
        )
    }

    static restoreShipmentFromDeleted(shipmentId: string) {
        return axios.put(
            `/api/shipments/${shipmentId}`,
            {headers: this.getHeaders()}
        )
    }

    static sendInventory(values: InventoryRequestBody) {
        return axios.post(
            "/api/inventory",
            values,
            {headers: this.getHeaders()}
        )
    }
}

export default HttpService;
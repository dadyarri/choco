import Headers from "./http.specs";
import axios, {AxiosResponse} from "axios";
import {UpdateOrderRequestBody, UpdateProductRequestBody} from "./request-bodies";

class HttpService {
    private static getHeaders(): Headers {
        return {}
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

    static restoreFromDeleted(orderId: string) {
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
}

export default HttpService;
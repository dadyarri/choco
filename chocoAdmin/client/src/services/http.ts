import Headers from "./http.specs";
import axios, {AxiosResponse} from "axios";
import {
    InventoryRequestBody,
    UpdateOrderRequestBody, UpdateProductCategoryRequestBody,
    UpdateProductRequestBody,
    UpdateShipmentRequestBody
} from "./request-bodies";
import {getToken, login, verifyToken} from "./jwt";

class HttpService {
    private static async getHeaders(): Promise<Headers> {
        const token = getToken();
        if (token) {
            const isValid = await verifyToken(token);
            if (!isValid) {
                const username = localStorage.getItem("username");
                const password = localStorage.getItem("password");

                if (username && password) {
                    await login(username, password)
                } else {
                    window.location.href = "/";
                }
            }
            return {Authorization: `Bearer ${token}`};
        }

        window.location.href = "/";
        return {}
    }

    public static async getProductById(productId: string): Promise<AxiosResponse> {
        return await axios.get(
            `/api/products/${productId}`,
            {headers: await this.getHeaders()}
        )
    }

    public static async getProducts(): Promise<AxiosResponse> {
        return await axios.get(
            "/api/products",
            {headers: await this.getHeaders()}
        )
    }

    public static async deleteProduct(itemId: string): Promise<AxiosResponse> {
        return await axios.delete(
            `/api/products/${itemId}`,
            {headers: await this.getHeaders()}
        )
    }

    public static async updateProduct(itemId: string, body: UpdateProductRequestBody): Promise<AxiosResponse> {
        return await axios.patch(
            `/api/products/${itemId}`,
            body,
            {headers: await this.getHeaders()}
        )
    }

    public static async getMarketUrl(marketId: number) {
        return await axios.get(
            `/api/vk/productUrl/${marketId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async getProductCategories() {
        return await axios.get(
            `/api/productCategories`,
            {headers: await this.getHeaders()}
        )
    }

    static async createProduct(body: UpdateProductRequestBody) {
        return await axios.post(
            "/api/products",
            body,
            {headers: await this.getHeaders()}
        )
    }

    static async getOrders() {
        return await axios.get(
            "/api/orders",
            {headers: await this.getHeaders()}
        )
    }

    static async getOrderStatuses() {
        return await axios.get(
            "/api/orderstatuses",
            {headers: await this.getHeaders()}
        )
    }

    static async getOrderById(orderId: string) {
        return await axios.get(
            `/api/orders/${orderId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async updateOrder(orderId: string, values: UpdateOrderRequestBody) {
        return await axios.patch(
            `/api/orders/${orderId}`,
            values,
            {headers: await this.getHeaders()}
        )
    }

    static async createOrder(values: UpdateOrderRequestBody) {
        return await axios.post(
            "/api/orders",
            values,
            {headers: await this.getHeaders()}
        )
    }

    static async deleteOrder(orderId: string) {
        return await axios.delete(
            `/api/orders/${orderId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async getOrderCities() {
        return await axios.get(
            "/api/ordercities",
            {headers: await this.getHeaders()}
        )
    }

    static async restoreOrderFromDeleted(orderId: string) {
        return await axios.put(
            `/api/orders/${orderId}`,
            {},
            {headers: await this.getHeaders()}
        )
    }

    static async getStatsByCity() {
        return await axios.get(
            "/api/Stats/ByCity",
            {headers: await this.getHeaders()}
        );
    }

    static async getTopProducts() {
        return await axios.get(
            "/api/Stats/TopProducts",
            {headers: await this.getHeaders()}
        );
    }

    static async getIncomesInfo(months: number) {
        return await axios.get(
            `/api/Stats/TotalIncomes/${months}`,
            {headers: await this.getHeaders()}
        );
    }

    static async getStatsByCategory() {
        return await axios.get(
            `/api/Stats/Categories`,
            {headers: await this.getHeaders()}
        );
    }

    static async getShipments() {
        return await axios.get(
            "/api/shipments",
            {headers: await this.getHeaders()}
        )
    }

    static async getShipmentById(shipmentId: string) {
        return await axios.get(
            `/api/shipments/${shipmentId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async getShipmentStatuses() {
        return await axios.get(
            "/api/shipmentstatuses",
            {headers: await this.getHeaders()}
        )
    }

    static async updateShipment(shipmentId: string, values: UpdateShipmentRequestBody) {
        return await axios.patch(
            `/api/shipments/${shipmentId}`,
            values,
            {headers: await this.getHeaders()}
        )
    }

    static async createShipment(values: UpdateShipmentRequestBody) {
        return await axios.post(
            "/api/shipments",
            values,
            {headers: await this.getHeaders()}
        )
    }

    static async deleteShipment(shipmentId: string) {
        return await axios.delete(
            `/api/shipments/${shipmentId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async restoreShipmentFromDeleted(shipmentId: string) {
        return await axios.put(
            `/api/shipments/${shipmentId}`,
            {},
            {headers: await this.getHeaders()}
        )
    }

    static async sendInventory(values: InventoryRequestBody) {
        return await axios.post(
            "/api/inventory",
            values,
            {headers: await this.getHeaders()}
        )
    }

    static async restoreProduct(productId: string) {
        return await axios.put(
            `/api/products/${productId}`,
            {},
            {headers: await this.getHeaders()}
        )
    }

    public static async deleteCategory(itemId: string): Promise<AxiosResponse> {
        return await axios.delete(
            `/api/productcategories/${itemId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async restoreCategoryFromDeleted(orderId: string) {
        return await axios.put(
            `/api/productcategories/${orderId}`,
            {},
            {headers: await this.getHeaders()}
        )
    }

    static async getProductCategoryById(productCategoryId: string) {
        return await axios.get(
            `/api/productcategories/${productCategoryId}`,
            {headers: await this.getHeaders()}
        )
    }

    static async updateProductCategory(itemId: string, body: UpdateProductCategoryRequestBody) {
        return await axios.patch(
            `/api/productcategories/${itemId}`,
            body,
            {headers: await this.getHeaders()}
        )
    }

    static async createProductCategory(body: UpdateProductCategoryRequestBody) {
        return await axios.post(
            "/api/productcategories",
            body,
            {headers: await this.getHeaders()}
        )
    }

    static async getRouteLink(address: string, latitude: number, longitude: number) {
        return await axios.post(
            "/api/geocode",
            {address, latitude, longitude},
            {headers: await this.getHeaders()}
        )
    }
}

export default HttpService;
import Headers from "./http.specs";
import axios, {AxiosResponse} from "axios";

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
}

export default HttpService;
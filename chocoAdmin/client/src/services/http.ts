import Headers from "./http.specs";
import axios, {AxiosResponse} from "axios";

class HttpService {
    private static getHeaders(): Headers {
        return {}
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
}

export default HttpService;
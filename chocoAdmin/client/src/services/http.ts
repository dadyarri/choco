import Headers from "./http.specs";
import { getToken, loginByRefreshToken, verifyToken } from "./jwt";

class HttpService {
    private static async refreshToken() {
        const username = localStorage.getItem("username");
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken === undefined) {
            localStorage.removeItem("token");
            window.location.href = "/";
        } else if (username && refreshToken) {
            await loginByRefreshToken(username, refreshToken);
        } else {
            window.location.href = "/";
        }
    }

    private static async getHeaders(): Promise<Headers> {
        const token = getToken();
        if (token) {
            const isValid = await verifyToken(token);
            if (!isValid) {
                await this.refreshToken();
            }
            return { Authorization: `Bearer ${token}` };
        }

        window.location.href = "/";
        return {};
    }
}

export default HttpService;

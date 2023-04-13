import { auth } from "features";
import { BaseApi } from "shared/api/lib";
import api from "shared/config/axios";

export type LoginResponse = {
    token: string;
    name: string;
    avatarUri: string;
    refreshToken: string;
};

export class AuthApi extends BaseApi {
    protected baseURL = "/auth";

    async passwordLogin(username: string, password: string) {
        try {
            const { data } = await api.post<LoginResponse>(`${this.baseURL}/passwordLogin`, {
                username,
                password,
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async passwordLessLogin(username: string, refreshToken: string) {
        try {
            const { data } = await api.post<LoginResponse>(`${this.baseURL}/passwordLessLogin`, {
                username,
                refreshToken,
            });
            return data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async verify() {
        try {
            await api.get(`${this.baseURL}/verify`, {
                headers: { Authorization: `Bearer ${auth.getToken()}` },
            });
            return true;
        } catch {
            return false;
        }
    }
}

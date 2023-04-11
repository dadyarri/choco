import { auth } from "shared/api";
import { LoginResponse } from "shared/api/auth";
import { sendSnackbar } from "shared/lib";

const updateAuthData = ({ token, avatarUri, refreshToken, name }: LoginResponse) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("avatarUri", avatarUri);
    localStorage.setItem("name", name);
};

const hasToken = () => {
    return Boolean(localStorage.getItem("token"));
};

export const login = (username: string, password: string) => {
    return auth.passwordLogin(username, password)
        .then((data) => {
            updateAuthData(data);
            return true;
        })
        .catch((error) => {
            switch (error.error.response.status) {
                case 403: {
                    sendSnackbar(error, "Ошибка входа (неверный пароль)");
                    break;
                }
                case 404: {
                    sendSnackbar(error, "Ошибка входа (несуществующий пользователь)");
                    break;
                }
                case 500: {
                    sendSnackbar(error, "Ошибка входа (проблемы с сервером)");
                    break;
                }
            }
            throw error;
        });
};

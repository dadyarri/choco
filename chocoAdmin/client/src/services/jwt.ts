import axios, {AxiosError, AxiosResponse} from "axios";
import {toast} from "react-toastify";

export const getToken = () => {
    return localStorage.getItem("token");
};

const updateLocalStorage = (username: string, loginResponse: AxiosResponse) => {
    localStorage.setItem("username", username);
    localStorage.setItem("refreshToken", loginResponse.data.refreshToken);
    localStorage.setItem("token", loginResponse.data.token);
    localStorage.setItem("name", loginResponse.data.name);
    localStorage.setItem("avatarUri", loginResponse.data.avatarUri);
};

export const loginByRefreshToken = (username: string, refreshToken: string) => {
    return axios.post("/api/auth/passwordLessLogin", {username, refreshToken})
        .then((response) => {
            updateLocalStorage(username, response);
            window.location.reload();
            return true;
        })
        .catch((error: AxiosError) => {
            if (error.response?.status === 404) {
                toast("Ошибка входа: Нет такого пользователя");
            }
            if (error.response?.status === 403) {
                toast("Ошибка входа: Неверный пароль");
            }
            return false;
        });
};

export const loginByPassword = (username: string, password: string) => {
    return axios.post("/api/auth/passwordLogin", {username, password})
        .then((response) => {
            updateLocalStorage(username, response);
            window.location.reload();
            return true;
        })
        .catch((error: AxiosError) => {
            if (error.response?.status === 404) {
                toast("Ошибка входа: Нет такого пользователя");
            }
            if (error.response?.status === 403) {
                toast("Ошибка входа: Неверный пароль");
            }
            return false;
        });
};

export const verifyToken = (token: string) => {
    return axios.get("/api/auth/verify", {headers: {Authorization: `Bearer ${token}`}})
        .then((_) =>  true)
        .catch((_) => false);
};
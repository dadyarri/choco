import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";

export const getToken = () => {
    return localStorage.getItem("token");
}

export const login = (username: string, password: string) => {
    return axios.post("/api/auth/login", {username, password})
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            return true;
        })
        .catch((error: AxiosError) => {
            if (error.response?.status === 404) {
                toast("Ошибка входа: Нет такого пользователя");
            }
            if (error.response?.status === 403) {
                toast(`Ошибка входа: Неверный пароль`);
            }
            return false;
        });
}

export const verifyToken = (token: string) => {
    return axios.get("/api/auth/verify", {headers: {Authorization: `Bearer: ${token}`}})
        .then((_) =>  true)
        .catch((_) => false);
}
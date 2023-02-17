import axios from "axios";
import {toast} from "react-toastify";

export const getToken = () => {
    return localStorage.getItem("token");
}

export const login = (username: string, password: string) => {
    return axios.post("/api/auth/login", {username, password})
        .then((response) => {
            localStorage.setItem("token", response.data.token)
        })
        .catch((error) => {
            toast(`Ошибка входа
            ${error.message}`)
        });
}

export const verifyToken = (token: string) => {
    return axios.get("/api/auth/verify", {headers: {Authorization: `Bearer: ${token}`}})
        .then((_) =>  true)
        .catch((_) => false);
}
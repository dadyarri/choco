import React, {FC} from "react";
import {useQuery} from "react-query";
import HttpService from "../services/http";
import {toast} from "react-toastify";
import {BeatLoader} from "react-spinners";

const Warehouse: FC = () => {

    const fetchProductsList = async () => {
        return await HttpService.getProducts()
            .then((response) => response.data)
            .catch((error) => {
                toast('Ошибка получения данных!');
            })
    }

    const {isLoading, isError, data, error} = useQuery('products', fetchProductsList)

    return (
        isLoading ?
            <BeatLoader color="#36d7b7"/> :
            <div>
                <h1>Склад</h1>
            </div>
    )
}

export default Warehouse;
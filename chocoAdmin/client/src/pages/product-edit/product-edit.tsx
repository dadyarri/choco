import {useParams} from "react-router-dom";
import {useQuery} from "react-query";
import Product from "../../services/types";
import {AxiosError} from "axios";
import getProductById from "./product-edit.utils";
import {BeatLoader} from "react-spinners";
import React from "react";

const ProductEdit = () => {
    let {productId} = useParams();

    const {
        isLoading,
        isError,
        data,
        error
    } = useQuery<Product, AxiosError>(
        ["product", productId],
        () => getProductById(productId!),
        {enabled: productId !== undefined}
    )

    return (
        isLoading ?
            <BeatLoader color="#36d7b7"/> :
            isError ?
                <div>
                    <h1>Ошибка загрузки</h1>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <h1>{data ? "Редактирование" : "Создание"} товара</h1>
                </div>
    )
}

export default ProductEdit;
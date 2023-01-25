import React, {FC} from "react";
import {useQuery} from "react-query";
import HttpService from "../services/http";
import {toast} from "react-toastify";
import {BeatLoader} from "react-spinners";
import {Table} from "react-bootstrap";
import Product from "../services/types";
import {GiWeight} from "react-icons/gi";
import {ImWarning} from "react-icons/im";

const Warehouse: FC = () => {

    const fetchProductsList = async () => {
        return await HttpService.getProducts()
            .then((response) => response.data)
            .catch((error) => {
                toast('Ошибка получения данных!');
            })
    }

    let {isLoading, isError, data, error} = useQuery<Product[]>('products', fetchProductsList)

    return (
        isLoading ?
            <BeatLoader color="#36d7b7"/> :
            <div>
                <h1>Склад</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Остаток</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data?.map(product =>
                        (!product.deleted && <tr key={product.id}  className={product.leftover < 0 ?
                            "table-danger" : ""}>
                            <td>{product.name} {product.isByWeight ? <GiWeight/> : null}</td>
                            <td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</td>
                            <td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                <ImWarning title={"Количество товара опустилось ниже нуля"}/> : null}</td>
                            <td></td>

                        </tr>))}
                    </tbody>
                </Table>
            </div>
    )
}

export default Warehouse;
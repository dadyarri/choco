import React, {FC} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {BeatLoader} from "react-spinners";
import {Button, ButtonGroup, Table} from "react-bootstrap";
import Product from "../../services/types";
import {GiWeight} from "react-icons/gi";
import {ImWarning} from "react-icons/im";
import {HiOutlineTrash, HiPencil} from "react-icons/hi";
import {SlSocialVkontakte} from "react-icons/sl";
import {AxiosError} from "axios";
import {deleteProduct, fetchProductsList, openEditModal, openVkPageOfProduct} from "./warehouse.utils";
import StatefulButton from "../../components/stateful-button/stateful-button";

const Warehouse: FC = () => {

    let {
        isLoading,
        isError,
        data,
        error
    } = useQuery<Product[], AxiosError>(
        'products',
        fetchProductsList,
    )
    const queryClient = useQueryClient();
    const deleteProductMutation = useMutation((id: string) => {
        return deleteProduct(id)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("products")
        }
    });

    return (
        isLoading ?
            <BeatLoader color="#36d7b7"/> :
            isError ?
                <div>
                    <h1>Ошибка загрузки</h1>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <h1>Склад</h1>
                    {data !== undefined && data.length > 0 && <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Остаток</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data?.map((product: Product) =>
                            (!product.deleted && <tr key={product.id} className={product.leftover < 0 ?
                                "table-danger" : ""}>
                                <td>{product.name} {product.isByWeight ? <GiWeight/> : null}</td>
                                <td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</td>
                                <td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                    <ImWarning title={"Количество товара опустилось ниже нуля"}/> : null}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button
                                            type={"button"}
                                            variant={"primary"}
                                            title={"Редактировать"}
                                            onClick={() => openEditModal(product.id)}>
                                            <HiPencil/>
                                        </Button>
                                        <StatefulButton
                                            variant={"danger"}
                                            title={"Удалить"}
                                            prefix={<HiOutlineTrash/>}
                                            postfixWhenActive={"Удалить?"}
                                            clickHandler={async (event) => {
                                                await deleteProductMutation.mutate(product.id)
                                            }}/>
                                        {product.marketId ? <Button
                                            variant={"primary"}
                                            type={"button"}
                                            title={"Открыть страницу товара в ВК"}
                                            onClick={() => openVkPageOfProduct(product.marketId)}
                                        >
                                            <SlSocialVkontakte/>
                                        </Button> : null}
                                    </ButtonGroup>
                                </td>

                            </tr>))}
                        </tbody>
                    </Table>}
                </div>
    )
}

export default Warehouse;
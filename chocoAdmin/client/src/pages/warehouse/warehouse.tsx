import React, {FC} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {BeatLoader} from "react-spinners";
import {Button, ButtonGroup, Table} from "react-bootstrap";
import Product from "../../services/types";
import {GiWeight} from "react-icons/gi";
import {ImWarning} from "react-icons/im";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {SlSocialVkontakte} from "react-icons/sl";
import {AxiosError} from "axios";
import {deleteProduct, fetchProductsList, openVkPageOfProduct} from "./warehouse.utils";
import StatefulButton from "../../components/stateful-button/stateful-button";
import {Link} from "react-router-dom";

const Warehouse: FC = () => {

    let {
        isLoading: isProductListLoading,
        isError: isProductListErrored,
        data: productListData,
        error: productListError
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

    const goToMarketMutation = useMutation((marketId: number) => {
        return openVkPageOfProduct(marketId)
    })

    return (
        isProductListLoading ?
            <BeatLoader color="#36d7b7"/> :
            isProductListErrored ?
                <div>
                    <h1>Ошибка загрузки</h1>
                    <p>{productListError?.message}</p>
                </div> :
                <div>
                    <h1>Склад</h1>
                    <Link to={"/warehouse/add"} className={"btn btn-success mb-3"}>
                        <HiPlus/> Создать
                    </Link>
                    {productListData !== undefined && productListData.length > 0 &&
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Остаток</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productListData?.map((product: Product) =>
                                (!product.deleted && <tr key={product.id} className={product.leftover < 0 ?
                                    "table-danger" : ""}>
                                    <td>{product.name} {product.isByWeight ? <GiWeight/> : null}</td>
                                    <td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</td>
                                    <td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                        <ImWarning title={"Количество товара опустилось ниже нуля"}/> : null}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Link
                                                title={"Редактировать"}
                                                type={"button"}
                                                to={`/warehouse/edit/${product.id}`}
                                                className={"btn btn-primary"}
                                            >
                                                <HiPencil/>
                                            </Link>
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
                                                onClick={async () => {
                                                    await goToMarketMutation.mutate(product.marketId);
                                                }}
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
import React, {FC} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {BeatLoader} from "react-spinners";
import {Product} from "../../services/types";
import {GiWeight} from "react-icons/gi";
import {ImWarning} from "react-icons/im";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {SlSocialVkontakte} from "react-icons/sl";
import {AxiosError} from "axios";
import {deleteProduct, fetchProductsList, openVkPageOfProduct} from "./index.utils";
import StatefulButton from "../../components/stateful-button";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

const Warehouse: FC = () => {

    const {
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
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{productListError?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Склад</Heading>
                    <Button as={Link} colorScheme={"green"} to={"/warehouse/add"} mb={4}>
                        <HiPlus/> Создать
                    </Button>
                    {productListData !== undefined && productListData.length > 0 &&
                        <TableContainer>
                            <Table variant={"striped"} colorScheme={"gray"}>
                                <Thead>
                                <Tr>
                                    <Th>Название</Th>
                                    <Th>На развес?</Th>
                                    <Th>Цена</Th>
                                    <Th>Остаток</Th>
                                    <Th>Действия</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                {productListData?.map((product: Product) =>
                                    (!product.deleted && <Tr key={product.id}>
                                        <Td>{product.name}</Td>
                                        <Td>{product.isByWeight ? <GiWeight/> : null}</Td>
                                        <Td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</Td>
                                        <Td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                            <ImWarning title={"Количество товара опустилось ниже нуля"}/> : null}</Td>
                                        <Td>
                                            <ButtonGroup>
                                                <Button
                                                    as={Link}
                                                    colorScheme={"blue"}
                                                    title={"Редактировать"}
                                                    type={"button"}
                                                    to={`/warehouse/edit/${product.id}`}
                                                    className={"btn btn-primary"}
                                                >
                                                    <HiPencil/>
                                                </Button>
                                                <StatefulButton
                                                    variant={"red"}
                                                    title={"Удалить"}
                                                    prefix={<HiOutlineTrash/>}
                                                    postfixWhenActive={"Удалить?"}
                                                    clickHandler={async (_event) => {
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
                                        </Td>

                                    </Tr>))}
                                </Tbody>
                            </Table>
                        </TableContainer>}
                </div>
    )
}

export default Warehouse;
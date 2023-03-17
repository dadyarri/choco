import React, {FC, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {BeatLoader} from "react-spinners";
import {Product} from "../../services/types";
import {GiWeight} from "react-icons/gi";
import {ImWarning} from "react-icons/im";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {SlSocialVkontakte} from "react-icons/sl";
import {AxiosError} from "axios";
import {deleteProduct, fetchProductsList, openVkPageOfProduct, restoreProduct} from "./index.utils";
import StatefulButton from "../../components/stateful-button";
import {Link} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControl,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {Field, Formik} from "formik";
import {MdRestoreFromTrash} from "react-icons/md";

const Warehouse: FC = () => {

    const productList = useQuery<Product[], AxiosError>(
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

    const restoreProductMutation = useMutation((id: string) => {
        return restoreProduct(id)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("products")
        }
    });

    const goToMarketMutation = useMutation((marketId: number) => {
        return openVkPageOfProduct(marketId)
    })

    const [showWholesalePrice, setShowWholesalePrice] = useState(false);

    return (
        productList.isLoading ?
            <BeatLoader color="#36d7b7"/> :
            productList.isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{productList.error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Склад</Heading>
                    <Button as={Link} leftIcon={<HiPlus/>} colorScheme={"green"} to={"/warehouse/add"} mb={4}>
                        Создать
                    </Button>
                    {productList.data !== undefined && productList.data.some(p => !p.deleted) &&
                        <TableContainer>
                            <Formik initialValues={{show: showWholesalePrice}} onSubmit={(values) => {
                                setShowWholesalePrice(values.show);
                            }}>
                                {({values, handleChange, submitForm}) => (
                                    <FormControl>
                                        <Field
                                            type={"checkbox"}
                                            as={Checkbox} name={"show"}
                                            value={values.show}
                                            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                                handleChange(ev);
                                                submitForm();
                                            }}
                                        >
                                            Показать оптовые цены
                                        </Field>
                                    </FormControl>
                                )}

                            </Formik>
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
                                    {productList.data?.map((product: Product) =>
                                        (!product.deleted && <Tr key={product.id}>
                                            <Td>{product.name}</Td>
                                            <Td>{product.isByWeight ? <GiWeight/> : null}</Td>
                                            <Td>{showWholesalePrice && product.wholesalePrice}{showWholesalePrice && " ("}{product.retailPrice}{showWholesalePrice && ")"} &#8381;</Td>
                                            <Td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                                <ImWarning
                                                    title={"Количество товара опустилось ниже нуля"}/> : null}</Td>
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
                                                        colorScheme={"teal"}
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

                    {productList.data?.some(p => p.deleted) &&
                        <>
                            <Heading as={"h1"} mb={4}>Удалённые товары</Heading>
                            <TableContainer>
                                <Table>
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
                                        {productList.data?.map((product: Product) =>
                                            (product.deleted && <Tr key={product.id}>
                                                <Td>{product.name}</Td>
                                                <Td>{product.isByWeight ? <GiWeight/> : null}</Td>
                                                <Td>{showWholesalePrice && product.wholesalePrice}{showWholesalePrice && " ("}{product.retailPrice}{showWholesalePrice && ")"} &#8381;</Td>
                                                <Td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                                                    <ImWarning
                                                        title={"Количество товара опустилось ниже нуля"}/> : null}</Td>
                                                <Td>
                                                    <ButtonGroup>
                                                        <StatefulButton
                                                            variant={"blue"}
                                                            title={"Восстановить"}
                                                            prefix={<MdRestoreFromTrash/>}
                                                            postfixWhenActive={"Восстановить?"}
                                                            clickHandler={async (_event) => {
                                                                await restoreProductMutation.mutate(product.id)
                                                            }}/>
                                                    </ButtonGroup>
                                                </Td>

                                            </Tr>))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    }

                </div>
    )
}

export default Warehouse;
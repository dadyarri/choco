import {Button, ButtonGroup, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {AxiosError} from "axios";
import React from "react";
import {FaTrashRestore} from "react-icons/fa";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Link} from "react-router-dom";
import {BeatLoader} from "react-spinners";

import {ProductCategory} from "entities/product-category";
import StatefulButton from "shared/ui/stateful-button";

import {deleteCategory, fetchCategoriesList, restoreCategory} from "./index.utils";

const ProductCategories = () => {

    const categories = useQuery<ProductCategory[], AxiosError>("categories", fetchCategoriesList);
    const queryClient = useQueryClient();

    const deleteCategoryMutation = useMutation(
        "deleteCategory",
        (categoryId: string) => deleteCategory(categoryId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("categories");

            }
        }
    );

    const restoreCategoryMutation = useMutation(
        "restoreCategory",
        (categoryId: string) => restoreCategory(categoryId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("categories");

            }
        }
    );

    return (
        categories.isLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            categories.isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{categories.error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Категории</Heading>
                    <Button as={Link} leftIcon={<HiPlus/>} colorScheme={"green"} to={"/categories/add"} mb={4}>
                        Создать
                    </Button>
                    {categories.data !== undefined && categories.data.some(c => !c.deleted) ?
                        <>
                            <TableContainer>
                                <Table variant={"striped"} colorScheme={"gray"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Название</Th>
                                            <Th>Действия</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {categories.data?.map((category: ProductCategory) => (
                                            (!category.deleted && <Tr key={category.id}>
                                                <Td>
                                                    {category.name}
                                                </Td>
                                                <Td>
                                                    <ButtonGroup>
                                                        <Button
                                                            as={Link}
                                                            colorScheme={"blue"}
                                                            title={"Редактировать"}
                                                            type={"button"}
                                                            to={`/categories/edit/${category.id}`}
                                                        >
                                                            <HiPencil/>
                                                        </Button>
                                                        <StatefulButton
                                                            variant={"red"}
                                                            title={"Удалить"}
                                                            prefix={<HiOutlineTrash/>}
                                                            postfixWhenActive={"Удалить?"}
                                                            clickHandler={async (_event) => {
                                                                deleteCategoryMutation.mutate(category.id);
                                                            }}/>
                                                    </ButtonGroup>
                                                </Td>
                                            </Tr>)
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                        : null}
                    {categories.data !== undefined && categories.data.some(c => c.deleted) ?
                        <>
                            <Heading as={"h1"} my={4}>Удалённые категории</Heading>

                            <TableContainer>
                                <Table variant={"striped"} colorScheme={"gray"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Название</Th>
                                            <Th>Действия</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {categories.data?.map((category: ProductCategory) => (
                                            (category.deleted && <Tr key={category.id}>
                                                <Td>
                                                    {category.name}
                                                </Td>
                                                <Td>
                                                    <StatefulButton
                                                        variant={"blue"}
                                                        title={"Восстановить"}
                                                        prefix={<FaTrashRestore/>}
                                                        postfixWhenActive={"Восстановить?"}
                                                        clickHandler={async (_event) => {
                                                            restoreCategoryMutation.mutate(category.id);
                                                        }}/>

                                                </Td>
                                            </Tr>)
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </> : null}
                    {categories.data !== undefined && categories.data.length === 0 &&
                        <Heading as={"h3"} size={"md"}>Нет категорий</Heading>}
                </div>
    );
};

export default ProductCategories;
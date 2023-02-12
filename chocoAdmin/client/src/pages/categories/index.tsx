import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {ProductCategory} from "../../services/types";
import {fetchCategoriesList} from "./index.utils";
import {BeatLoader} from "react-spinners";
import {Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import React from "react";

const ProductCategories = () => {

    const {isLoading, isError, data, error} = useQuery<ProductCategory[], AxiosError>("categories", fetchCategoriesList);

    return (
        isLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Категории</Heading>
                    {data !== undefined && data.length > 0 ?
                        <TableContainer>
                            <Table variant={"striped"} colorScheme={"gray"}>
                                <Thead>
                                    <Tr>
                                        <Th>Название</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.map((category: ProductCategory) => (
                                        <Tr key={category.id}>
                                            <Td>
                                                {category.name}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <Heading as={"h3"} size={"md"}>Нет категорий</Heading>
                    }
                </div>
    )
}

export default ProductCategories;
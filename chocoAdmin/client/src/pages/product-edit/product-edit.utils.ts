import Product from "../../services/types";
import HttpService from "../../services/http";
import {toast} from "react-toastify";

const getProductById = async (productId: string): Promise<Product> => {
    return await HttpService.getProductById(productId)
        .then((response) => response.data)
        .catch((error) => {
            toast("Ошибка получения информации о товаре!");
            return error;
        });
}

export default getProductById;
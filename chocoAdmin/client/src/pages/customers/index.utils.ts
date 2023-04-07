import HttpService from "../../services/http";
import {toast} from "react-toastify";

export const fetchCustomersList = () => {
    return HttpService.getCustomers()
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка получения списка клиентов
            ${error.data.message}`);
            throw error;
        })
}
export const deleteCustomer = (id: string) => {
    return HttpService.deleteCustomer(id)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка удаления клиента
            ${error.data.message}`);
            throw error;
        })
}
export const restoreCustomer = (id: string) => {
    return HttpService.restoreCustomerFromDeleted(id)
        .then((response) => response.data)
        .catch((error) => {
            toast(`Ошибка восстановления клиента
            ${error.data.message}`);
            throw error;
        })
}
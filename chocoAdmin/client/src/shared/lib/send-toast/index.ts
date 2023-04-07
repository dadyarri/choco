import {Error} from "entities";
import {toast} from "react-toastify";

export const sendToast = (info: Error, message: string) => {
    toast(`${message}
    ${info.message}`);
    throw info.error;
}
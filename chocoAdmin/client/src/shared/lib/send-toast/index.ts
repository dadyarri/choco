import {toast} from "react-toastify";

import {Error} from "entities/error";

export const sendToast = (info: Error, message: string) => {
    toast(`${message}
    ${info.message}`);
    throw info.error;
};
import { enqueueSnackbar } from "notistack";
import { Error } from "entities/error";

export const sendToast = (info: Error, message: string) => {
    enqueueSnackbar(`${message}
    ${info.message}`);
    throw info.error;
};

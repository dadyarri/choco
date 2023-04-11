import { enqueueSnackbar } from "notistack";

import { Error } from "entities/error";

export const sendSnackbar = (
    errorDetails: Error,
    message: string,
    variant: "default" | "error" | "warning" | "info" | "success" = "error",
) => {
    enqueueSnackbar(`${message}: ${errorDetails.message}`, { variant: variant });
};

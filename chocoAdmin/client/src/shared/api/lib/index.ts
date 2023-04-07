import axios, {AxiosError} from "axios";
import {Error} from "entities";

export const handleError = (error: AxiosError | unknown): Error => {
    let message: string;
    if (axios.isAxiosError(error)) {
        if (error.response) {
            message = `API Error (${error.response.status}): ${error.response.data}`;
            console.error(message);
        } else if (error.request) {
            message = 'API Error (No Response)';
            console.error(message, error.request);
        } else {
            message = 'API Error';
            console.error(message, error.message);
        }
    } else {
        message = 'Unexpected Error';
        console.error(message, error);
    }
    return {message: message, error: error};
}

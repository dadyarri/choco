import axios, {AxiosError} from "axios";

export const handleError = (error: AxiosError | unknown) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const message: string = `API Error (${error.response.status}): ${error.response.data}`;
            console.error(message);
            return message;
        } else if (error.request) {
            const message: string = 'API Error (No Response)';
            console.error(message, error.request);
            return message;
        } else {
            const message: string = 'API Error';
            console.error(message, error.message);
            return message;
        }
    } else {
        const message: string = 'Unexpected Error';
        console.error(message, error);
        return message;
    }
}
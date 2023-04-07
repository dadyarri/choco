import {AxiosError} from "axios";

export type Error = {
    message: string,
    error: AxiosError | unknown
}
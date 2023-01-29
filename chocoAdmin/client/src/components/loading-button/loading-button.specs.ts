import {MouseEventHandler} from "react";

export type LoadingButtonSpecs = {
    variant: string
    label: string
    title: string
    isSubmitting: boolean
    type?: "button" | "submit" | "reset" | undefined
    clickHandler?: MouseEventHandler<HTMLButtonElement>
}
import {MouseEventHandler, ReactNode} from "react";

type StatefulButtonProps = {
    variant: string
    title: string
    prefix: string | ReactNode
    postfixWhenActive: string | ReactNode
    clickHandler: MouseEventHandler<HTMLButtonElement>
    activeByDefault?: boolean

}

export default StatefulButtonProps;
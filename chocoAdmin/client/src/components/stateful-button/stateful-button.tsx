import React, {FC, MouseEventHandler, useState} from "react";
import {Button} from "react-bootstrap";
import StatefulButtonProps from "./stateful-button.specs";

const StatefulButton: FC<StatefulButtonProps> = ({
                                                     variant,
                                                     title,
                                                     clickHandler,
                                                     prefix,
                                                     postfixWhenActive,
                                                     activeByDefault = false
                                                 }) => {

    const [isActive, setIsActive] = useState(activeByDefault);
    const [clickCount, setClickCount] = useState(0);
    const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>, baseHandler: MouseEventHandler<HTMLButtonElement>) => {
        let count = clickCount + 1;
        setClickCount(count)

        if (count === 1) {
            setIsActive(true)
            setTimeout(() => {
                setIsActive(false)
                setClickCount(0)
            }, 3000)
        } else if (count === 2) {
            baseHandler(event)
        }
    }

    return (
        <Button
            variant={variant}
            type={"button"}
            title={title}
            active={isActive}
            onClick={(event) => {
                buttonClickHandler(event, clickHandler)
            }}
        >
            {prefix} {isActive && postfixWhenActive}
        </Button>
    )
}

export default StatefulButton;
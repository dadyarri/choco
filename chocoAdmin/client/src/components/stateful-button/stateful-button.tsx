import React, {FC, MouseEventHandler, useState} from "react";
import StatefulButtonProps from "./stateful-button.specs";
import {Button, Spinner} from "@chakra-ui/react";

const StatefulButton: FC<StatefulButtonProps> = ({
                                                     variant,
                                                     title,
                                                     clickHandler,
                                                     prefix,
                                                     postfixWhenActive,
                                                     activeByDefault = false,
                                                 }) => {

    const [isActive, setIsActive] = useState(activeByDefault);
    const [clickCount, setClickCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const buttonClickHandler = (event: React.MouseEvent<HTMLButtonElement>, baseHandler: MouseEventHandler<HTMLButtonElement>) => {
        const count = clickCount + 1;
        setClickCount(count)

        if (count === 1) {
            setIsActive(true)
            setTimeout(() => {
                setIsActive(false);
                setIsLoading(false);
                setClickCount(0);
            }, 3000)
        } else if (count === 2) {
            setIsLoading(() => {
                baseHandler(event);
                return true;
            });
        }
    }

    return (
        <Button
            variant={variant}
            type={"button"}
            title={title}
            isLoading={isLoading}
            onClick={(event) => {
                buttonClickHandler(event, clickHandler)
            }}
        >
            <span>{prefix} {isActive && !isLoading && postfixWhenActive}</span>
        </Button>
    )
}

export default StatefulButton;
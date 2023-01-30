import React, {FC} from "react";
import {LoadingButtonSpecs} from "./loading-button.specs";
import {Button, Spinner} from "@chakra-ui/react";

export const LoadingButton: FC<LoadingButtonSpecs> = ({
                                                          variant,
                                                          label,
                                                          title,
                                                          type,
                                                          isSubmitting,
                                                          clickHandler
                                                      }) => {

    return (
        <Button
            variant={variant}
            title={title}
            type={type}
            onClick={(event) => {
                if (clickHandler) {
                    clickHandler(event);
                }
            }}>
            {isSubmitting &&
                <Spinner size={"xs"}/>}&nbsp;
            {label}
        </Button>
    )

}
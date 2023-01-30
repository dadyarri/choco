import React, {FC} from "react";
import {LoadingButtonSpecs} from "./index.specs";
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
            colorScheme={variant}
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
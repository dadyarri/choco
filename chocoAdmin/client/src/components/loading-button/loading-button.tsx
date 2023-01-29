import React, {FC} from "react";
import {LoadingButtonSpecs} from "./loading-button.specs";
import {Button, Spinner} from "react-bootstrap";

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
                <Spinner animation="border" role="status" size={"sm"}>
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>}&nbsp;
            {label}
        </Button>
    )

}
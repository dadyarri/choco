import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "features";

export default () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const navigate = useNavigate();

    return (
        <>
            <Typography variant={"h4"}>Войти в аккаунт</Typography>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                onSubmit={(values) => {
                    auth.login(values.username, values.password).then(
                        (success) => success && navigate("/app"),
                    );
                }}
            >
                {({ values, handleChange, touched, errors }) => (
                    <Form>
                        <Stack spacing={3} sx={{ width: { sm: "90%", md: 400 }, margin: 2 }}>
                            <FormControl variant={"outlined"}>
                                <InputLabel>Логин</InputLabel>
                                <Field
                                    as={OutlinedInput}
                                    name={"username"}
                                    label={"Логин"}
                                    value={values.username}
                                    error={errors.password}
                                    onChange={handleChange}
                                />
                                <FormHelperText>
                                    {touched.username && errors.username}
                                </FormHelperText>
                            </FormControl>
                            <FormControl variant="outlined">
                                <InputLabel>Пароль</InputLabel>
                                <Field
                                    as={OutlinedInput}
                                    name={"password"}
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Пароль"
                                    value={values.password}
                                    error={errors.password}
                                    onChange={handleChange}
                                    required
                                />
                                <FormHelperText>
                                    {touched.password && errors.password}
                                </FormHelperText>
                            </FormControl>
                            <Button variant={"contained"} type={"submit"}>
                                Войти
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
};

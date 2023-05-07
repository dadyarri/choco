import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HomeIcon from "@mui/icons-material/Home";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListIcon from "@mui/icons-material/List";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NumbersIcon from "@mui/icons-material/Numbers";
import SaveIcon from "@mui/icons-material/Save";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Field, FieldArray, Form, Formik } from "formik";
import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import { orderCityLib, OrderItem, orderLib, orderStatusLib, productLib } from "entities";
import { createOrder, updateOrder } from "entities/order/lib";
import { auth } from "features";

const OrderEditPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    auth.hasToken().then((result) => !result && navigate("/app/login"));
  }, [navigate]);

  const { orderId } = useParams();

  const editMode = Boolean(orderId);

  const order = useQuery(["order", orderId], () => orderLib.getOrderById(orderId!), {
    enabled: editMode,
  });

  const orderStatuses = useQuery("orderStatuses", orderStatusLib.getOrderStatuses);

  const orderCities = useQuery("orderCities", orderCityLib.getOrderCities);

  const products = useQuery("products", productLib.getProducts);

  const getStatusIcon = (statusName: string) => {
    switch (statusName) {
      case "Обрабатывается": {
        return <ScheduleIcon />;
      }
      case "Доставляется": {
        return <LocalShippingIcon />;
      }
      case "Выполнен": {
        return <CheckCircleOutlineIcon />;
      }
      case "Отменён": {
        return <HighlightOffIcon />;
      }
      case "Ожидает получения": {
        return <HourglassTopIcon />;
      }
      default: {
        return undefined;
      }
    }
  };

  return (
    <>
      <Typography variant={"h4"} sx={{ marginBottom: 2 }}>
        {editMode ? "Редактирование" : "Создание"} заказа
      </Typography>
      <Button
        sx={{ marginBottom: 2 }}
        color={"secondary"}
        variant={"outlined"}
        component={Link}
        startIcon={<ChevronLeftIcon />}
        to={"/app/orders"}
      >
        Назад
      </Button>
      {order.isLoading ? (
        <CircularProgress />
      ) : (
        <Formik
          initialValues={{
            date: order.data ? DateTime.fromFormat(order.data.date, "yyyy-MM-dd") : DateTime.now(),
            status: order.data ? order.data.status.id : "",
            address: {
              city: order.data ? order.data.address.city.id : "",
              street: order.data ? order.data.address.street : "",
              building: order.data ? order.data.address.building : "",
            },
            orderItems: order.data ? order.data.orderItems : [],
          }}
          onSubmit={(values) => {
            const data = {
              ...values,
              date: values.date.toFormat("yyyy-MM-dd"),
            };
            console.log(data);
            if (order.data) {
              updateOrder(order.data.id, data);
            } else {
              createOrder(data);
            }
          }}
        >
          {({ values, touched, errors, handleChange, setFieldValue }) => (
            <Form>
              <Stack spacing={3} sx={{ width: { sm: "90%", md: 400 }, margin: 2 }}>
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <CalendarMonthIcon sx={{ marginRight: 1 }} /> <span>Дата</span>
                  </Typography>
                </InputLabel>
                <Field
                  as={DatePicker}
                  name={"date"}
                  id={"date"}
                  variant={"outlined"}
                  value={values.date}
                  onChange={(value: any) => setFieldValue("date", value, true)}
                  label={"Дата заказа"}
                  error={touched.date && errors.date}
                  type={"date"}
                  format={"dd.MM.yyyy"}
                />
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <ViewTimelineIcon sx={{ marginRight: 1 }} /> <span>Статус заказа</span>
                  </Typography>
                </InputLabel>
                <Field
                  as={Select}
                  name={"status"}
                  id={"status"}
                  variant={"outlined"}
                  label={"Статус заказа"}
                  type={"select"}
                  value={values.status}
                  onChange={handleChange}
                  error={touched.status && errors.status}
                >
                  <MenuItem defaultChecked disabled>
                    -- Выберите статус --
                  </MenuItem>
                  {orderStatuses.data &&
                    orderStatuses.data.map((status) => (
                      <MenuItem value={status.id} key={status.id}>
                        <ListItemIcon>{getStatusIcon(status.name)}</ListItemIcon>
                        {status.name}
                      </MenuItem>
                    ))}
                </Field>
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <LocationCityIcon sx={{ marginRight: 1 }} /> <span>Город</span>
                  </Typography>
                </InputLabel>
                {!orderCities.isLoading && (
                  <Field
                    as={Select}
                    name={"address.city"}
                    id={"city"}
                    variant={"outlined"}
                    label={"Город"}
                    type={"select"}
                    value={values.address.city}
                    onChange={handleChange}
                    error={touched.address?.city && errors.address?.city}
                  >
                    <MenuItem defaultChecked disabled>
                      -- Выберите город --
                    </MenuItem>
                    {orderCities.data &&
                      orderCities.data.map((city) => (
                        <MenuItem value={city.id} key={city.id}>
                          {city.name}
                        </MenuItem>
                      ))}
                  </Field>
                )}
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <EditRoadIcon sx={{ marginRight: 1 }} /> <span>Улица</span>
                  </Typography>
                </InputLabel>
                <Field
                  as={TextField}
                  name={"address.street"}
                  id={"street"}
                  label={"Улица"}
                  value={values.address.street}
                />
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <HomeIcon sx={{ marginRight: 1 }} /> <span>Дом</span>
                  </Typography>
                </InputLabel>
                <Field
                  as={TextField}
                  name={"address.building"}
                  id={"building"}
                  label={"Дом"}
                  value={values.address.building}
                />
                <InputLabel>
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <ListIcon sx={{ marginRight: 1 }} /> <span>Содержимое заказа</span>
                  </Typography>
                </InputLabel>
                <FieldArray
                  name={"orderItems"}
                  render={(arrayHelpers) => {
                    return (
                      <>
                        {values.orderItems.length > 0 &&
                          values.orderItems &&
                          values.orderItems.map((orderItem: OrderItem, index) => (
                            <Paper key={index} elevation={0}>
                              <Stack spacing={2}>
                                <Paper sx={{ padding: 2 }}>
                                  <InputLabel sx={{ marginY: 1 }}>
                                    <Typography
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <InventoryIcon sx={{ marginRight: 1 }} /> <span>Товар</span>
                                    </Typography>
                                  </InputLabel>
                                  <Field
                                    type={"select"}
                                    value={values.orderItems[index].product.id}
                                    name={`orderItems[${index}].id`}
                                    as={Select}
                                    onChange={handleChange}
                                  >
                                    <MenuItem defaultChecked disabled>
                                      -- Выберите товар --
                                    </MenuItem>
                                    {products.data &&
                                      products.data.map((product) => (
                                        <MenuItem
                                          disabled={product.leftover <= 0}
                                          key={product.id}
                                          value={product.id}
                                        >
                                          <ListItemText
                                            primary={product.name}
                                            secondary={`${product.retailPrice}₽/${
                                              product.isByWeight ? "кг." : "шт."
                                            }`}
                                          />
                                        </MenuItem>
                                      ))}
                                  </Field>
                                </Paper>
                                <Paper sx={{ padding: 2 }}>
                                  <InputLabel sx={{ marginY: 1 }}>
                                    <Typography
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <NumbersIcon sx={{ marginRight: 1 }} />{" "}
                                      <span>Количество</span>
                                    </Typography>
                                  </InputLabel>
                                  <Field
                                    name={`orderItems[${index}].amount`}
                                    as={TextField}
                                    value={orderItem.amount}
                                    type={"number"}
                                  />
                                </Paper>
                                <Paper sx={{ padding: 2 }}>
                                  <InputLabel sx={{ marginY: 1 }}>
                                    <Typography
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <AutoAwesomeIcon sx={{ marginRight: 1 }} />{" "}
                                      <span>Действия</span>
                                    </Typography>
                                  </InputLabel>
                                  <ButtonGroup>
                                    <IconButton
                                      color={"error"}
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </ButtonGroup>
                                </Paper>
                              </Stack>
                            </Paper>
                          ))}
                        <Button
                          variant={"outlined"}
                          color={"success"}
                          startIcon={<AddIcon />}
                          onClick={() =>
                            arrayHelpers.push({
                              id: "",
                              amount: 0,
                            })
                          }
                        >
                          Добавить
                        </Button>
                      </>
                    );
                  }}
                />
                <Button type={"submit"} variant={"outlined"} startIcon={<SaveIcon />}>
                  Сохранить
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default OrderEditPage;

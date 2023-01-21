import React, {useEffect, useState} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {Link} from "react-router-dom";
import {HiOutlineTrash, HiPencil} from "react-icons/hi2";
import $ from "jquery";
import {Button, FormGroup, Input, Label, List, Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {Field, Form, Formik} from "formik";
import {FaMapMarkedAlt, FaTrashRestore} from "react-icons/fa";
import 'here-js-api/scripts/mapsjs-core';
import 'here-js-api/scripts/mapsjs-service';
import {ToastsList} from "../Parts/Toasts/ToastsList";

export const Orders = () => {
    const Here = window.H;
    const orderSchema = {date: '', address: {city: {name: ''}, building: '', street: ''}, status: {id: ''}};

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpened, setIsEditModalOpened] = useState(false);
    const [editModalData, setEditModalData] = useState(orderSchema);
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [toasts, setToasts] = useState([]);
    
    useEffect( () => {
        populateOrdersStatuesesData();
        populateOrdersData();
    }, [])

    const getOrderStatusIcon = (status) => {
        switch (status) {
            case "Выполнен": {
                return <GiCheckMark/>
            }
            case "Доставляется": {
                return <TbTruckDelivery/>
            }
            case "Обрабатывается": {
                return <GiSandsOfTime/>
            }
            case "Отменён": {
                return <GiCancel/>
            }
            default: {
                return null
            }
        }
    }

    const deleteConfirm = async (itemId) => {
        let button = $(`.btn.btn-danger[data-item-id="${itemId}"]`);
        let clickCount = parseInt(button.attr("data-clicked"));

        clickCount += 1
        button.attr("data-clicked", clickCount);

        if (clickCount === 1) {
            button.attr("aria-pressed", true);
            setTimeout(() => {
                button.attr("aria-pressed", false);
                button.attr("data-clicked", 0);
            }, 3000)
        } else if (clickCount === 2) {
            await axios.delete(`/api/orders/${itemId}`)
            await populateOrdersData();
        }
    }

    const openEditModal = async (itemId) => {
        await axios.get(`/api/orders/${itemId}`).then(response => {
            setEditModalData(response.data);
            setIsEditModalOpened(true);
        });
    }

    const plotRoute = async (address) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;

                const platform = new Here.service.Platform({
                    'apikey': process.env.REACT_APP_HERE_TOKEN
                });
                const service = platform.getSearchService();
                service.geocode({
                    q: address
                }, (result) => {
                    const url = `https://yandex.ru/maps/?mode=routes&rtext=${lat},${long}~${result.items[0].position.lat},${result.items[0].position.lng}`;
                    window.open(url, "_blank");
                })

            }, () => {
                setToasts([toasts, {
                    id: toasts.length + 1,
                    heading: "Ошибка построения маршрута",
                    body: "Доступ к местоположению необходим для построения маршрута",
                    color: "danger"
                }])
            })
        }
    }

    const renderOrdersTable = (orders) => {
        return (
            <div className={"table-responsive-md"}>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Содержимое заказа</th>
                        <th>Адрес</th>
                        <th>Итог</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order =>
                        (!order.deleted && <tr key={uuid()}>
                            <td>{new Date(order.date).toLocaleDateString("ru-RU")} {getOrderStatusIcon(order.status.name)}</td>
                            <td>
                                <ul>
                                    {order.orderItems.map(item =>
                                        <li key={uuid()}>{item.product.name} x{item.amount}</li>
                                    )}
                                </ul>
                            </td>
                            <td>г.&nbsp;{order.address.city.name}, {order.address.street}, {order.address.building}&nbsp;
                                <Button color={"success"} title={"Проложить маршрут"}
                                        onClick={() =>
                                            plotRoute(`г. ${order.address.city.name}, ${order.address.street}, ${order.address.building}`)}>
                                    <FaMapMarkedAlt/>
                                </Button>
                            </td>
                            <td>
                                {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button className={"btn btn-primary"} title={"Редактировать"} type={"button"}
                                            onClick={() => openEditModal(order.id)}
                                    >
                                        <HiPencil/>
                                    </button>
                                    <button className={"btn btn-danger"} title={"Удалить"} data-bs-toggle="button"
                                            data-item-id={order.id}
                                            data-clicked={0}
                                            aria-pressed={"false"}
                                            type={"button"}
                                            onClick={() => deleteConfirm(order.id)}><HiOutlineTrash/>
                                    </button>
                                </div>
                            </td>
                        </tr>)
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    const populateOrdersData = async () => {
        await axios.get("/api/orders")
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
    }

    const populateOrdersStatuesesData = async () => {
        await axios.get("/api/orderStatuses")
            .then((response) =>
                setOrderStatuses(response.data)
            );
    }

    const restoreDeleted = async (id) => {
        await axios.put(`/api/orders/${id}`)
            .then(async () => {
                await populateOrdersData();
            });
    }



    const closeEditModal = () => {
        setIsEditModalOpened(false);
        setEditModalData(orderSchema);
    };

    const renderDeletedOrdersTable = (orders) => {
        return <Table responsive={"md"} striped>
            <thead>
            <tr>
                <th>Дата</th>
                <th>Содержимое заказа</th>
                <th>Адрес</th>
                <th>Итог</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {orders.map(order =>
                (order.deleted && <tr key={uuid()}>
                    <td>{new Date(order.date).toLocaleDateString("ru-RU")} {getOrderStatusIcon(order.status.name)}</td>
                    <td>
                        <ul>
                            {order.orderItems.map(item =>
                                <li key={uuid()}>{item.product.name} x{item.amount}</li>
                            )}
                        </ul>
                    </td>
                    <td>г.&nbsp;{order.address.city.name}, {order.address.street}, {order.address.building}
                    </td>
                    <td>
                        {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                    </td>
                    <td>
                        <button className={"btn btn-primary"} title={"Восстановить"} type={"button"}
                                onClick={() => restoreDeleted(order.id)}
                        >
                            <FaTrashRestore/>
                        </button>
                    </td>
                </tr>)
            )}
            </tbody>
        </Table>
    }

    const render = () => {
        let contents = loading
            ? <p><em>Загрузка...</em></p>
            : renderOrdersTable(orders);
        let deletedContents = loading
            ? <p><em>Загрузка...</em></p>
            : renderDeletedOrdersTable(orders);

        const editData = editModalData;

        return (
            <>
                <Modal isOpen={isEditModalOpened}>
                    <ModalHeader toggle={closeEditModal}>Редактирование заказа</ModalHeader>
                    <ModalBody>
                        <Formik initialValues={{
                            date: editData.date,
                            orderItems: editData.orderItems,
                            status: editData.status.id
                        }}
                                onSubmit={async (values) => {
                                    values.orderId = editData.id;
                                    await axios.put(`/api/orders`, values)
                                        .then(async () => {
                                            closeEditModal();
                                            await populateOrdersData();
                                        })
                                        .catch((error) => {
                                            if (error.response.status === 409) {
                                                setToasts([...toasts, {
                                                    id: toasts.length + 1,
                                                    heading: "Ошибка редактирования заказа",
                                                    body: `Переход ${error.response.data} невозможен`,
                                                    color: "danger"
                                                }]);
                                            }
                                        });

                                }}>
                            {({values}) => (
                                <Form>
                                    <FormGroup>
                                        <Label>Дата заказа</Label>
                                        <Field as={Input} disabled name={"date"}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Содержимое заказа</Label>
                                        <List>
                                            {values.orderItems.map((item) => (
                                                <li key={item.id}>{item.product.name} x{item.amount}</li>
                                            ))}
                                        </List>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Статус заказа</Label>
                                        <Field as={Input} type={"select"} name={"status"}>
                                            {orderStatuses.map((os) => (
                                                <option key={os.id} value={os.id}>{os.name}</option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Адрес</Label>
                                        <Field as={Input} disabled name={"address"}
                                               value={`г. ${editData.address.city.name}, ${editData.address.street}, ${editData.address.building}`}/>
                                    </FormGroup>
                                    <Button color={"success"} type={"submit"}>Сохранить</Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <div>
                    <h1 id="tableLabel">Заказы</h1>
                    <div className={"btn-group"}>
                        <button className={"btn btn-primary"} onClick={() => populateOrdersData()}>Обновить
                        </button>
                        <Link className={"btn btn-success"} to={"/orders/new"}>Создать</Link>
                    </div>
                    {contents}

                    <h1>Удалённые заказы</h1>
                    {deletedContents}
                </div>
                <ToastsList toastList={toasts}/>
            </>
        );
    }
    
    return render();
}

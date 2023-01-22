import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {HiOutlineTrash, HiPencil} from "react-icons/hi2";
import {Link} from "react-router-dom";
import $ from "jquery";
import {Button, FormGroup, Input, Label, List, Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {Field, Form, Formik} from "formik";
import {FaTrashRestore} from "react-icons/fa";
import {ToastsList} from "../Parts/Toasts/ToastsList";

export class Shipments extends Component {
    static displayName = Shipments.name;

    shipmentSchema = {date: '', status: {name: '', id: ''}, shipmentItems: [], deleted: false, id: ''}

    constructor(props) {
        super(props);
        this.state = {
            shipments: [],
            loading: true,
            isEditModalOpened: false,
            editModalData: this.shipmentSchema,
            shipmentStatuses: [],
            toasts: []
        };
    }

    async componentDidMount() {
        await this.populateShipmentsData();
        await this.populateShipmentStatusesData();
    }

    getShipmentStatusIcon(status) {
        switch (status) {
            case "Выполнена": {
                return <GiCheckMark/>
            }
            case "Доставляется": {
                return <TbTruckDelivery/>
            }
            case "Обрабатывается": {
                return <GiSandsOfTime/>
            }
            case "Отменена": {
                return <GiCancel/>
            }
            default: {
                return null
            }
        }
    }

    async deleteConfirm(itemId) {
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
            await axios.delete(`/api/shipments/${itemId}`)
            await this.populateShipmentsData();
        }
    }

    async openEditModal(itemId) {
        await axios.get(`/api/shipments/${itemId}`).then(response => {
            this.setState({isEditModalOpened: true, editModalData: response.data});
        });
    }

    closeEditModal = () => {
        this.setState({
            isEditModalOpened: false,
            editModalData: this.shipmentSchema
        });
    };

    renderShipmentsTable(shipments) {
        return (
            <div className={"table-responsive-md"}>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Содержимое заказа</th>
                        <th>Итог</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shipments.map(shipment =>
                        (!shipment.deleted ? <tr key={uuid()}>
                            <td>{new Date(shipment.date).toLocaleDateString("ru-RU")} {this.getShipmentStatusIcon(shipment.status.name)}</td>
                            <td>
                                <ul>
                                    {shipment.shipmentItems.map(item =>
                                        <li key={uuid()}>{item.product.name} x{item.amount}</li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                {shipment.shipmentItems.reduce((sum, item) => sum + item.product.wholesalePrice * item.amount, 0)} &#8381;
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button className={"btn btn-primary"} title={"Редактировать"} type={"button"}
                                            onClick={() => this.openEditModal(shipment.id)}
                                    >
                                        <HiPencil/>
                                    </button>
                                    <button className={"btn btn-danger"} title={"Удалить"} data-bs-toggle="button"
                                            data-item-id={shipment.id}
                                            data-clicked={0}
                                            aria-pressed={"false"}
                                            type={"button"}
                                            onClick={() => this.deleteConfirm(shipment.id)}><HiOutlineTrash/>
                                    </button>
                                </div>
                            </td>
                        </tr> : null)
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    renderDeletedShipmentsTable = (shipments) => {
        return <Table responsive={"md"} striped>
            <thead>
            <tr>
                <th>Дата</th>
                <th>Содержимое поставки</th>
                <th>Итог</th>
                <th>Действия</th>
            </tr>
            </thead>
            <tbody>
            {shipments.map(shipment =>
                (shipment.deleted && <tr key={uuid()}>
                    <td>{new Date(shipment.date).toLocaleDateString("ru-RU")} {this.getShipmentStatusIcon(shipment.status.name)}</td>
                    <td>
                        <ul>
                            {shipment.shipmentItems.map(item =>
                                <li key={uuid()}>{item.product.name} x{item.amount}</li>
                            )}
                        </ul>
                    </td>
                    <td>
                        {shipment.shipmentItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                    </td>
                    <td>
                        <button className={"btn btn-primary"} title={"Восстановить"} type={"button"}
                                onClick={() => this.restoreDeleted(shipment.id)}
                        >
                            <FaTrashRestore/>
                        </button>
                    </td>
                </tr>)
            )}
            </tbody>
        </Table>
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderShipmentsTable(this.state.shipments);
        let deletedContents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderDeletedShipmentsTable(this.state.shipments);


        const editData = this.state.editModalData;

        return (
            <>
                <Modal isOpen={this.state.isEditModalOpened}>
                    <ModalHeader toggle={this.closeEditModal}>Редактирование поставки</ModalHeader>
                    <ModalBody>
                        <Formik initialValues={{
                            date: editData.date,
                            shipmentItems: editData.shipmentItems,
                            status: editData.status.id
                        }}
                                onSubmit={async (values) => {
                                    values.shipmentId = editData.id;
                                    await axios.put(`/api/shipments`, values)
                                        .then(async () => {
                                            this.closeEditModal();
                                            await this.populateShipmentsData();
                                        })
                                        .catch((error) => {
                                            if (error.response.status === 409) {
                                                this.setState({
                                                    toasts: [...this.state.toasts, {
                                                        id: this.state.toasts.length + 1,
                                                        heading: "Ошибка редактирования поставки",
                                                        body: `Переход ${error.response.data} невозможен`,
                                                        color: "danger"
                                                    }]
                                                });
                                            }
                                        });

                                }}>
                            {({values}) => (
                                <Form>
                                    <FormGroup>
                                        <Label>Дата поставки</Label>
                                        <Field as={Input} disabled name={"date"}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Содержимое поставки</Label>
                                        <List>
                                            {values.shipmentItems.map((item) => (
                                                <li key={item.id}>{item.product.name} x{item.amount}</li>
                                            ))}
                                        </List>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Статус заказа</Label>
                                        <Field as={Input} type={"select"} name={"status"}>
                                            {this.state.shipmentStatuses.map((os) => (
                                                <option key={os.id} value={os.id}>{os.name}</option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                    <Button color={"success"} type={"submit"}>Сохранить</Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <div>
                    <h1 id="tableLabel">Поставки</h1>
                    <div className={"btn-group"}>
                        <button className={"btn btn-primary"} onClick={() => this.populateShipmentsData()}>Обновить
                        </button>
                        <Link className={"btn btn-success"} to={"/shipments/new"}>Создать</Link>
                    </div>
                    {contents}

                    {this.state.shipments.some((el) => el.deleted) &&
                        <div>
                            <h1>Удалённые поставки</h1>
                            {deletedContents}
                        </div>
                    }
                </div>
                <ToastsList toastList={this.state.toasts}/>
            </>
        );
    }

    async populateShipmentsData() {
        await axios.get("/api/shipments")
            .then((response) =>
                this.setState({shipments: response.data, loading: false}))
    }

    async populateShipmentStatusesData() {
        await axios.get("/api/shipmentStatuses")
            .then((response) =>
                this.setState({shipmentStatuses: response.data}))
    }

    async restoreDeleted(id) {
        await axios.put(`/api/shipments/${id}`);
        await this.populateShipmentsData();
    }
}

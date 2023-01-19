import {Toast, ToastBody, ToastHeader} from "reactstrap";
import {useEffect, useState} from "react";

export const ToastsList = ({toastList}) => {

    const [list, setList] = useState(toastList);

    useEffect(() => {
        setList(toastList)
    }, [toastList, list])

    const deleteToast = (id) => {
        list.splice(id - 1, 1)
        setList([...list])
    }

    return <div className={"toasts-list"}>
        {list?.map((toast) => (
            <Toast key={toast?.id} className={toast.color ? `text-bg-${toast.color} m-2` : 'm-2'}>
                <ToastHeader toggle={() => {
                    deleteToast(toast?.id)
                }}>
                    {toast?.heading}
                </ToastHeader>
                <ToastBody>
                    {toast?.body}
                </ToastBody>
            </Toast>
        ))}
    </div>
}

import {useParams} from "react-router-dom";

const WarehouseEdit = () => {
    const {productId} = useParams();
    return <h1>{productId}</h1>
}

export default WarehouseEdit;
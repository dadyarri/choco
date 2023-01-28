import {useParams} from "react-router-dom";

const ProductEdit = () => {
    const {productId} = useParams();
    return <h1>{productId}</h1>
}

export default ProductEdit;
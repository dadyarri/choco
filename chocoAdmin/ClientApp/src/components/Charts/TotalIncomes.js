import {Badge} from "reactstrap";
import {BsArrowDownRight, BsArrowUpRight} from "react-icons/bs";

export const TotalIncomes = ({data}) => {
    return <div className={"d-flex"}>
        <b style={{fontSize: "30px"}}>{data[0].total} &#8381;</b>&nbsp;
        <span>{data[0].total >= data[1].total ? <Badge
            color="success"
            style={{fontSize: "20px"}}
        >
            <BsArrowUpRight/>&nbsp;
            {Math.abs(data[0].total - data[1].total)}
        </Badge> : <Badge
            color="danger"
            style={{fontSize: "20px"}}
        >
            <BsArrowDownRight/>&nbsp;
            {Math.abs(data[0].total - data[1].total)}
        </Badge>}</span>
    </div>
}
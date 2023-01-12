import {Badge} from "reactstrap";
import {BsArrowDownRight, BsArrowUpRight} from "react-icons/bs";

export const TotalIncomes = ({data}) => {
    console.log(data);
    return <div className={"d-flex"}>
        <p>{data[0].total}</p>&nbsp;
        <span>{data[0].total >= data[1].total ? <Badge
            color="success"
            pill
        >
            <BsArrowUpRight/>&nbsp;
            {Math.abs(data[0].total - data[1].total)}
        </Badge> : <Badge
            color="danger"
            pill
        >
            <BsArrowDownRight/>&nbsp;
            {Math.abs(data[0].total - data[1].total)}
        </Badge>}</span>
    </div>
}
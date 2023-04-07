import compose from "compose-function";
import { withRouter } from "./with-router";
import {withChakra} from "./with-chakra";
import {withReactQuery} from "./with-react-query";
import {withLayout} from "./with-layout";

export const withProviders = compose(withChakra, withRouter, withLayout, withReactQuery);
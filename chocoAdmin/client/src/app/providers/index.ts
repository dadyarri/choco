import compose from "compose-function";

import { withChakra } from "./with-chakra";
import { withLayout } from "./with-layout";
import { withReactQuery } from "./with-react-query";
import { withRouter } from "./with-router";

export const withProviders = compose(withChakra, withRouter, withLayout, withReactQuery);

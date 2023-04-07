import React from "react";
import Layout from "../../components/layout";

export const withLayout = (component: () => React.ReactNode) => () => (
    <Layout>
        {component()}
    </Layout>
);
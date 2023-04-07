import React from "react";
import Layout from "shared/ui/layout";

export const withLayout = (component: () => React.ReactNode) => () => (
    <Layout>
        {component()}
    </Layout>
);
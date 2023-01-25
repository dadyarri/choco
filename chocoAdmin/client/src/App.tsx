import React, {FC} from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from "./components/layout";
import routes from "./routes";

const App: FC = () => {
    return (
        <Layout>
            <Routes>
                {routes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
            </Routes>
        </Layout>
    );
}

export default App;

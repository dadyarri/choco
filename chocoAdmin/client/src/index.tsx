import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/index.css';
import App from './app';
import {BrowserRouter} from "react-router-dom";
import theme from './theme';
import { ColorModeScript } from '@chakra-ui/react';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App/>
        </BrowserRouter>
    </React.StrictMode>
);

import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {Warehouse} from "./components/Warehouse";
import {Shipments} from "./components/Shipments";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/orders',
    element: <Counter />
  },
  {
    path: '/shipments',
    element: <Shipments />
  },
  {
    path: '/shipments/new',
    element: <Counter />
  },
  {
    path: '/warehouse',
    element: <Warehouse />
  }
];

export default AppRoutes;

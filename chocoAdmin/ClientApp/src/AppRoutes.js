import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import {Warehouse} from "./components/Warehouse";

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
    element: <FetchData />
  },
  {
    path: '/warehouse',
    element: <Warehouse />
  }
];

export default AppRoutes;

import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";

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
    element: <FetchData />
  }
];

export default AppRoutes;

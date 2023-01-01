import {Home} from "./components/Home";
import {Warehouse} from "./components/Warehouse";
import {Shipments} from "./components/Shipments";
import {CreateShipment} from "./components/CreateShipment";
import {Orders} from "./components/Orders";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/orders',
    element: <Orders />
  },
  {
    path: '/shipments',
    element: <Shipments />
  },
  {
    path: '/shipments/new',
    element: <CreateShipment />
  },
  {
    path: '/warehouse',
    element: <Warehouse />
  }
];

export default AppRoutes;

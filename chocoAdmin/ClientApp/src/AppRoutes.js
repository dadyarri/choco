import {Home} from "./components/Home";
import {Warehouse} from "./components/Warehouse";
import {Shipments} from "./components/Shipments";
import {CreateShipment} from "./components/CreateShipment";
import {Orders} from "./components/Orders";
import {CreateOrder} from "./components/CreateOrder";
import {CreateProduct} from "./components/CreateProduct";
import {Categories} from "./components/Categories";
import {CreateCategory} from "./components/CreateCategory";

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
    path: '/orders/new',
    element: <CreateOrder />
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
  },
  {
    path: '/warehouse/new',
    element: <CreateProduct />
  },
  {
    path: '/categories',
    element: <Categories/>
  },
  {
    path: '/categories/new',
    element: <CreateCategory/>
  }
];

export default AppRoutes;

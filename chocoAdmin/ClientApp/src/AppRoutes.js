import {Home} from "./components/Pages/Home";
import {Orders} from "./components/Pages/Orders";
import {CreateOrder} from "./components/Pages/CreateOrder";
import {Shipments} from "./components/Pages/Shipments";
import {CreateShipment} from "./components/Pages/CreateShipment";
import {Warehouse} from "./components/Pages/Warehouse";
import {CreateProduct} from "./components/Pages/CreateProduct";
import {Categories} from "./components/Pages/Categories";
import {CreateCategory} from "./components/Pages/CreateCategory";

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

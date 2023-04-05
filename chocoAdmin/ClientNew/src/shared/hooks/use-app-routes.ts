import {useMemo} from "react";
import {matchPath, useLocation} from "react-router";
import routes from "../config/routes";

const useAppRoutes = () => {
  const { pathname } = useLocation();

  const getPath = (url: string) =>
    routes?.find((route) => matchPath(route.path as string, url));

  const pathSnippets = useMemo(
    () => pathname.split("/").filter((i) => i),
    [pathname]
  );

  return {
    getPath,
    pathSnippets,
    currentPath: pathname,
    routes,
  };
};

export default useAppRoutes;
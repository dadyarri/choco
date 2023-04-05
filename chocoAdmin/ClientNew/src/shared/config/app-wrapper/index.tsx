import {ConfigProvider} from "antd";
import ruLocale from "antd/locale/ru_RU";
import React from "react";
import {Outlet} from "react-router-dom";

export const AppWrapper = () => {

  return (
    <ConfigProvider locale={ruLocale} componentSize="small">
      <Outlet/>
    </ConfigProvider>
  );
};
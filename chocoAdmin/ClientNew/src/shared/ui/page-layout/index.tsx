import {Layout, Menu, Typography} from "antd";
import type {MenuProps} from "antd/es/menu";
import React, {FC, ReactNode, useState} from "react";
import {Link} from "react-router-dom";
import {Route} from "../../../entities/route";
import routes from "../../config/routes";

const {Header, Sider, Content, Footer} = Layout;
const {Title} = Typography;
type MenuItem = Required<MenuProps>["items"][number];

export const PageLayout: FC<AppLayoutProps> = ({children}) => {

  const [collapsed, setCollapsed] = useState(true);

  const getItem = (
    {label, path, key, icon}: Route
  ): MenuItem => {
    return {
      key,
      icon,
      label: <Link to={path}>{label}</Link>,
    } as MenuItem;
  };


  return <Layout>
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div style={{ height: 32, margin: 16 }} />
      <Menu theme="dark" defaultSelectedKeys={[location.pathname]} mode="inline" items={routes.map((route) => getItem(route))} />
    </Sider>
    <Layout>
      <Header style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}>
        <Title style={{color: "#ffffff"}} level={2}>Шокоадминка</Title>
      </Header>
      <Content className="site-layout" style={{padding: "0 10px", minHeight: "84vh"}}>
        {children}
      </Content>
      <Footer style={{textAlign: "center"}}>ChocoManager v1.5.0 &copy; 2023 dadyarri</Footer>
    </Layout>
  </Layout>;
};

type AppLayoutProps = {
  children: ReactNode
}
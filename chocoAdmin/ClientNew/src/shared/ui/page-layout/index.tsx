import {Layout, Menu, Typography} from "antd";
import React, {FC, ReactNode} from "react";

const {Header, Content, Footer} = Layout;
const {Title} = Typography;

export const PageLayout: FC<AppLayoutProps> = ({children}) => {

  return <Layout>
    <Header style={{
      position: "sticky",
      top: 0,
      zIndex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <Title style={{color: "#ffffff"}} level={2}>Шокоадминка</Title>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={new Array(3).fill(null).map((_, index) => ({
          key: String(index + 1),
          label: `nav ${index + 1}`,
        }))}
      />
    </Header>
    <Content className="site-layout" style={{padding: "0 10px"}}>
      {children}
    </Content>
    <Footer style={{textAlign: "center"}}>ChocoManager v1.5.0 &copy; 2023 dadyarri</Footer>
  </Layout>;
};

type AppLayoutProps = {
  children: ReactNode
}
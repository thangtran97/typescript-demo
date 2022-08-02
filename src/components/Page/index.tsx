import React, { ReactElement } from "react";
import "antd/dist/antd.css";
import { Layout, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";

const { Header, Content, Sider, Footer } = Layout;

interface PropTypes {
    content: ReactElement;
}

const navBarItems: MenuProps["items"] = [
    {
        label: <Link to={"/"}>Home</Link>,
        key: "home",
    },
    {
        label: "item 2",
        key: "item-2",
    },
    {
        label: "sub menu",
        key: "submenu",
        children: [
            {
                label: "item 3",
                key: "submenu-item-1",
            },
        ],
    },
];

const sideBarItems: MenuProps["items"] = [
    {
        label: <Link to={"/videos"}>Videos</Link>,
        key: "videos",
    },
];

const Page: React.FC<PropTypes> = props => {
    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" items={navBarItems} />
            </Header>
            <Layout
                className="site-layout-background"
                style={{ padding: "24px 0" }}
            >
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        style={{ height: "100%", borderRight: 0 }}
                        items={sideBarItems}
                    />
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Content
                        style={{
                            padding: "0 24px",
                            minHeight: 770,
                            overflow: "auto",
                        }}
                    >
                        {props.content}
                    </Content>
                </Layout>
            </Layout>
            <Footer style={{ textAlign: "center" }}>
                NEV ©2022 Created by thangth
            </Footer>
        </Layout>
    );
};

export default Page;

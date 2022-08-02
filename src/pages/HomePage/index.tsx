import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import Page from "../../components/Page";
import logo from "../../logo.svg";

const HomePage: React.FC = () => (
    <Page
        content={
            <img
                style={{ marginLeft: 500, marginTop: 200 }}
                src={logo}
                className="App-logo"
                alt="logo"
            />
        }
    />
);

export default HomePage;

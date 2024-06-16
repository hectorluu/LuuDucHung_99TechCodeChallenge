import React, { useState } from "react";
import { Layout, Menu } from "antd";
import Solution1 from "./components/Solution1";
import Solution2 from "./components/Solution2";
import Solution3 from "./components/Solution3";

const { Header, Content, Footer } = Layout;

const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `Problem ${key}`,
}));

const App = () => {
  const [selectedCard, setSelectedCard] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedCard(e.key);
  };

  const renderCard = () => {
    switch (selectedCard) {
      case "1":
        return <Solution1 />;
      case "2":
        return <Solution2 />;
      case "3":
        return <Solution3 />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ display: "flex", flexDirection: "column" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          fontSize: "1.2em",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items1}
          onClick={handleMenuClick}
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "1.2em",
          }}
        />
      </Header>
      <Content
        style={{
          width: "100%",
          backgroundColor: "#f0f0f0",
          padding: 20,
          overflowY: "scroll",
          fontSize: "1.5em",
        }}
      >
        {renderCard()}
      </Content>
      <Footer
        style={{
          position: "static",
          textAlign: "center",
          fontWeight: "600",
          backgroundColor: "#1f1f1f",
          color: "white",
        }}
      >
        99Tech Code Challenge - Solutions provided by Luu Duc Hung
      </Footer>
    </Layout>
  );
};
export default App;

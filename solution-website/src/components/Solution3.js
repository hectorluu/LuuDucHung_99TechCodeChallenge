import React from "react";
import { Card } from "antd";

function Solution3() {
  return (
    <Card
      title={<span style={{ fontSize: "1.3em" }}>Problem 3: Messy React</span>}
      style={{
        width: "100%",
        fontSize: "1.02rem",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
      }}
    >
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  );
}

export default Solution3;

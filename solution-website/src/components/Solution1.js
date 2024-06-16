import React from "react";
import { Card } from "antd";
import { CopyBlock, dracula } from "react-code-blocks";

const solution1 = `// Calculates the sum of all integers from 1 to n using mathematical formula.
var sum_to_n_a = function (n) {
  if (n < 0) {
    return (n * (n - 1)) / 2;
  } else {
    return (n * (n + 1)) / 2;
  }
};

// Calculates the sum of all integers from 1 to n using a loop.
var sum_to_n_b = function (n) {
  let answer = 0;
  if (n < 0) {
    for (let i = n; i <= -1; i++) {
      answer += i;
    }
  } else {
    for (let i = 1; i <= n; i++) {
      answer += i;
    }
  }

  return answer;
};

// Calculates the sum of all integers from 1 to n using recursion.
var sum_to_n_c = function (n) {
  if (n === 0) {
    return 0;
  } else if (n < 0) {
    return n + sum_to_n_c(n + 1);
  } else {
    return n + sum_to_n_c(n - 1);
  }
};`;

function Solution1() {
  return (
    <Card
      title={
        <span style={{ fontSize: "1.3em" }}>
          Problem 1: Three ways to sum to n
        </span>
      }
      style={{
        width: "100%",
        fontSize: "1.02rem",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
      }}
    >
      <p>
        In this problem, it's important to note that integers can also be{" "}
        <span style={{ fontWeight: "bold" }}>negative</span>. I have provided
        three different ways to calculate the sum to n:
      </p>
      <ul>
        <li>Using a mathematical formula.</li>
        <li>Using a loop.</li>
        <li>Using recursion.</li>
      </ul>
      <CopyBlock
        text={solution1}
        language={"jsx"}
        showLineNumbers={true}
        wrapLines
        theme={dracula}
      />
    </Card>
  );
}

export default Solution1;

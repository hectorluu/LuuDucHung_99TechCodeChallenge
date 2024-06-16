import React, { useEffect, useRef, useState } from "react";
import { Card, InputNumber } from "antd";
import { Button, Col, Form, Row, Select, Space, theme } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import currencies from "../data/currencies";
import { debounce } from "lodash";

const { Option } = Select;

function toMaxFixed(value, decimalPlaces) {
  let result = Number(value).toFixed(decimalPlaces);
  while (result.includes(".") && result.slice(-1) === "0") {
    result = result.slice(0, -1);
  }
  if (result.slice(-1) === ".") {
    result = result.slice(0, -1);
  }
  return Number(result);
}

const AdvancedSearchForm = ({
  setResult,
  isConverted,
  setIsConverted,
  currencyData1,
  currencyData2,
  selectedCurrency1,
  setSelectedCurrency1,
  selectedCurrency2,
  setSelectedCurrency2,
  tokenImages1,
  setTokenImages1,
  tokenImages2,
  setTokenImages2,
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const formStyle = {
    maxWidth: "none",
    background: "#fafafa",
    borderRadius: token.borderRadiusLG,
    padding: 24,
  };

  const swapCurrencies = () => {
    const temp = selectedCurrency1;
    setSelectedCurrency1(selectedCurrency2);
    setSelectedCurrency2(temp);
  };

  // Load images for both currencies
  useEffect(() => {
    const loadImages = async (currencies) => {
      let images = {};
      for (let currency of currencies) {
        try {
          images[currency.currency] = await import(
            `../data/tokens/${currency.currency}.svg`
          );
        } catch (e) {}
      }
      return images;
    };

    const loadImagesForBothCurrencies = async () => {
      const images1 = await loadImages(currencyData1);
      const images2 = await loadImages(currencyData2);
      setTokenImages1(images1);
      setTokenImages2(images2);
    };

    loadImagesForBothCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use the useEffect hook to update the form fields when the state changes
  useEffect(() => {
    form.setFieldsValue({
      From: selectedCurrency1,
      To: selectedCurrency2,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency1, selectedCurrency2]);

  const getFields = () => {
    return (
      <>
        <Col
          span={7}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Form.Item
            style={{
              width: "100%",
            }}
            name={"Amount"}
            label={
              <span style={{ fontSize: "1.2em", fontWeight: 650 }}>Amount</span>
            }
            rules={[
              { required: true, message: "Please input a valid amount!  " },
              {
                type: "number",
                min: 0,
                message: "Amount must be a positive number!",
              },
              () => ({
                validator(_, value) {
                  if (!value || Number(value.toFixed(4)) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Amount can have up to 4 decimal places!")
                  );
                },
              }),
            ]}
            initialValue={10}
          >
            <InputNumber
              min={0}
              max={Number.MAX_SAFE_INTEGER}
              onChange={debounce(() => form.submit(), 500)}
              placeholder="Enter the amount"
              size="large"
              style={{ width: "100%", lineHeight: "4rem" }}
            />
          </Form.Item>
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Form.Item
            style={{
              width: "100%",
            }}
            name={"From"}
            label={
              <span style={{ fontSize: "1.2em", fontWeight: 650 }}>From</span>
            }
            rules={[
              {
                required: true,
                message: "Select something!",
              },
            ]}
            initialValue={selectedCurrency1}
          >
            <Select
              key={selectedCurrency1}
              size="large"
              style={{ height: "4rem" }}
              onChange={(value) => {
                setSelectedCurrency1(value);
                form.submit();
              }}
            >
              {currencyData1.map((currency) => (
                <Option key={currency.currency} value={currency.currency}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                    }}
                  >
                    <img
                      src={tokenImages1[currency.currency]?.default}
                      alt={currency.currency}
                      style={{ marginRight: 12, width: 32 }}
                    />
                    {currency.currency}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col
          span={1}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            shape="circle"
            size="large"
            icon={<SwapOutlined style={{ fontSize: "24px" }} />}
            style={{ height: "2.5rem", marginTop: "0.5rem" }}
            onClick={() => {
              swapCurrencies();
              debounce(() => form.submit(), 500)();
            }}
          />
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Form.Item
            style={{
              width: "100%",
            }}
            name={"To"}
            label={
              <span style={{ fontSize: "1.2em", fontWeight: 650 }}>To</span>
            }
            rules={[
              {
                required: true,
                message: "Select something!",
              },
            ]}
            initialValue={selectedCurrency2}
          >
            <Select
              key={selectedCurrency2}
              size="large"
              style={{ height: "4rem" }}
              onChange={(value) => {
                setSelectedCurrency2(value);
                form.submit();
              }}
            >
              {currencyData2.map((currency) => (
                <Option key={currency.currency} value={currency.currency}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 0",
                    }}
                  >
                    <img
                      src={tokenImages2[currency.currency]?.default}
                      alt={currency.currency}
                      style={{ marginRight: 12, width: 32 }}
                    />
                    {currency.currency}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </>
    );
  };

  const onFinish = (values) => {
    const amount = values.Amount;
    const price1 = currencies.find(
      (c) => c.currency === selectedCurrency1
    ).price;
    const price2 = currencies.find(
      (c) => c.currency === selectedCurrency2
    ).price;
    const conversionResult = (amount * price1) / price2;
    setResult(toMaxFixed(conversionResult, 8));
    setIsConverted(true);
  };

  const formRef = useRef();

  return (
    <Form
      form={form}
      ref={formRef}
      name="advanced_search"
      style={{
        ...formStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Row
        style={{
          height: 130,
          width: "90%",
        }}
        gutter={24}
      >
        {getFields()}
      </Row>
      <div
        style={{
          textAlign: "right",
        }}
      >
        <Space size="small">
          {!isConverted && (
            <Button
              htmlType="submit"
              style={{
                borderRadius: "2rem",
                fontSize: "1.3em",
                height: "2.5rem",
                width: "10rem",
                color: "white",
                background: "#0050b3",
              }}
              onClick={() => form.submit()}
            >
              Convert
            </Button>
          )}
          {/* <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            Clear
          </Button> */}
        </Space>
      </div>
    </Form>
  );
};

function Solution2() {
  const [result, setResult] = useState(toMaxFixed(0, 8));
  const [isConverted, setIsConverted] = useState(false);
  const [conversionRate1, setConversionRate1] = useState(0);
  const [conversionRate2, setConversionRate2] = useState(0);

  const currencyData1 = [...currencies];
  const currencyData2 = [...currencies];

  const [selectedCurrency1, setSelectedCurrency1] = useState(
    currencyData1[0].currency
  );
  const [selectedCurrency2, setSelectedCurrency2] = useState(
    currencyData2[1].currency
  );

  const [tokenImages1, setTokenImages1] = useState({});
  const [tokenImages2, setTokenImages2] = useState({});

  useEffect(() => {
    const price1 = currencies.find(
      (c) => c.currency === selectedCurrency1
    ).price;
    const price2 = currencies.find(
      (c) => c.currency === selectedCurrency2
    ).price;

    let conversionrateTemp1 = price1 / price2;
    let conversionrateTemp2 = price2 / price1;

    setConversionRate1(toMaxFixed(conversionrateTemp1, 8));
    setConversionRate2(toMaxFixed(conversionrateTemp2, 8));
  }, [selectedCurrency1, selectedCurrency2]);

  return (
    <Card
      title={<span style={{ fontSize: "1.3em" }}>Problem 2: Fancy Form</span>}
      style={{
        width: "100%",
        fontSize: "1.02rem",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
      }}
    >
      <AdvancedSearchForm
        isConverted={isConverted}
        setIsConverted={setIsConverted}
        currencyData1={currencyData1}
        currencyData2={currencyData2}
        selectedCurrency1={selectedCurrency1}
        setSelectedCurrency1={setSelectedCurrency1}
        selectedCurrency2={selectedCurrency2}
        setSelectedCurrency2={setSelectedCurrency2}
        tokenImages1={tokenImages1}
        setTokenImages1={setTokenImages1}
        tokenImages2={tokenImages2}
        setTokenImages2={setTokenImages2}
        setResult={setResult}
      />
      {isConverted && (
        <div
          style={{
            height: "10rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#e6f4ff",
            marginTop: "-2rem",
          }}
        >
          <p style={{ fontWeight: "bold" }}>Result</p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#003a8c" }}>
            {result + " " + selectedCurrency2}
          </p>
          <p style={{ fontWeight: "lighter" }}>
            1 {selectedCurrency1} = {conversionRate1} {selectedCurrency2}
          </p>
          <p style={{ fontWeight: "lighter" }}>
            1 {selectedCurrency2} = {conversionRate2} {selectedCurrency1}
          </p>
        </div>
      )}

      <Divider />

      <p>These are the contraints that I have added for the Fancy form:</p>
      <ul>
        <li>
          I use component{" "}
          <span style={{ fontWeight: "bold" }}>{"<InputNumber />"}</span> from
          Ant Design to accept only number from the input.
        </li>
        <li>The amount must not be empty.</li>
        <li>The amount must be positive.</li>
        <li>The amount can only have up to 4 decimal places.</li>
        <li>
          The minimun amount is 0 and the maximum amout is
          Number.MAX_SAFE_INTEGER.
        </li>
      </ul>
      <p>
        Besides, while solving this problem, because there are a lot of repeated
        currencies so I removed those in the provided json file.
      </p>
    </Card>
  );
}

export default Solution2;

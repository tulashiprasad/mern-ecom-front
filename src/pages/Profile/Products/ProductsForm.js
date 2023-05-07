import { Col, Form, Input, Modal, Row, Tabs, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddProduct, EditProduct } from "../../../apicalls/product";
import { setLoader } from "../../../redux/loaderSlice";
import Images from "./Images";

const ProductsForm = ({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData,
}) => {
  const [selectedTab = "1", setSelectedTab] = useState("1");
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const additionalThings = [
    {
      label: "Bill Available",
      name: "billAvailable",
    },
    {
      label: "Warranty Available",
      name: "warrantyAvailable",
    },
    {
      label: "Accessories Available",
      name: "accessoriesAvailable",
    },
    {
      label: "Box Available",
      name: "boxAvailable",
    },
  ];
  const rules = [
    {
      required: true,
      message: "Required",
    },
  ];
  const onFinish = async (values) => {
    for (const key in values) {
      if (values[key] === undefined) {
        values[key] = false;
      }
      console.log(key + ": " + values[key]);
    }
    try {
      dispatch(setLoader(true));
      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      } else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values);
      }
      dispatch(setLoader(false));
      if (response.success) {
        message.success(response.message);
        setShowProductForm(false);
        getData();
        dispatch(setLoader(false));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  const formRef = useRef(null);
  useEffect(() => {
    formRef.current.setFieldsValue(selectedProduct);
  }, [selectedProduct]);

  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => formRef.current.submit()}
      {...(selectedTab === "2" && { footer: false })}
    >
      <div>
        <h1 className="text-2xl text-rpimary text-center font-semibold uppercase ">
          {selectedProduct ? "Edit Product" : "Add Products"}
        </h1>
        <Tabs
          defaultActiveKey="1"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)}
        >
          <Tabs.TabPane tab="General" key="1">
            <Form layout="vertical" ref={formRef} onFinish={onFinish}>
              <Form.Item label="Name" name="name" className="p-2" rules={rules}>
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                className="p-2"
                rules={rules}
              >
                <TextArea type="text" />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    label="Price"
                    name="price"
                    className="p-2"
                    rules={rules}
                  >
                    <Input type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Catagory"
                    name="catagory"
                    className="p-2"
                    rules={rules}
                  >
                    <select>
                      <option value="">Select</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home</option>
                      <option value="sports">Sports</option>
                    </select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Age"
                    name="age"
                    className="p-2"
                    rules={rules}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>
              <div className="flex gap-10">
                {additionalThings.map((item) => {
                  return (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      key={item.name}
                      valuePropName="checked"
                    >
                      <Input
                        type="checkbox"
                        value={item.name}
                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            [item.name]: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldValue(item.name)}
                      />
                    </Form.Item>
                  );
                })}
              </div>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
            <Images
              selectedProduct={selectedProduct}
              setShowProductForm
              getData={getData}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ProductsForm;

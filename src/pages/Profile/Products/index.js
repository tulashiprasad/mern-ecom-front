import { Button, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import ProductsForm from "./ProductsForm";
import { useDispatch } from "react-redux";
import moment from "moment";
import { setLoader } from "../../../redux/loaderSlice";
import { GetProduct, DeleteProduct } from "../../../apicalls/product";

const Products = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [product, setProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const deleteProductHandle = async (id) => {
    try {
      dispatch(setLoader(true));
      const response = await DeleteProduct(id);
      if (response.success) {
        message.success(response.message);
        dispatch(setLoader(false));
      } else {
        dispatch(setLoader(false));
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Catagory",
      dataIndex: "catagory",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added on ",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5 ">
            <i
              className="ri-delete-bin-line  text-red-500 cursor-pointer"
              onClick={() => deleteProductHandle(record._id)}
            ></i>
            <i
              className="ri-edit-2-line cursor-pointer"
              onClick={() => {
                setSelectedProduct(record);
                setShowProductForm(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];
  const getData = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetProduct();
      setProduct(response.data);
      dispatch(setLoader(false));
      if (response.success) {
        dispatch(setLoader(false));
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    console.log(product);
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(true);
            setSelectedProduct(null);
          }}
        >
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={product} className="my-5" />
      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}
    </div>
  );
};

export default Products;

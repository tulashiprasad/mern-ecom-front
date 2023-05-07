import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/user";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";

const ProtectedPage = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validateToken = async () => {
    try {
      dispatch(setLoader(true));
      const response = await GetCurrentUser();
      dispatch(setLoader(false));

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/login");
      }
    } catch (error) {
      dispatch(setLoader(false));
      navigate("/login");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-primary p-5">
          {/* headder  */}
          <h1 className="text-2xl text-white">SHEY MP</h1>
          <div className="  bg-white py-2 px-5 rounded flex gap-1 items-center">
            <i className="ri-shield-user-line"></i>
            <span
              className="cursor-pointer underline"
              onClick={() => navigate("/profile")}
            >
              {user.name.toUpperCase()}
            </span>
            <i
              className="ri-logout-circle-r-line ml-5 text-red-500 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        <div className="p-5">
          {/* body  */}
          {children}
        </div>
      </div>
    )
  );
};

export default ProtectedPage;

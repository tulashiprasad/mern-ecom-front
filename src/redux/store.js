import { configureStore } from "@reduxjs/toolkit";
import { loaderSlice } from "./loaderSlice";
import { userSlice } from "./userSlice";
import { productSlice } from "./productSlice";

const store = configureStore({
  reducer: {
    loaders: loaderSlice.reducer,
    users: userSlice.reducer,
    products: productSlice.reducer,
  },
});

export default store;

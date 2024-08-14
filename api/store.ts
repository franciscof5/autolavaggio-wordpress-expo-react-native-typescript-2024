import { configureStore } from "@reduxjs/toolkit";
import vehicleApi from "./vehicle/vehicleApi";
import orderApi from "./order/orderApi";
import { currentUserApi } from './currentUserApi/currentUserApi';
import mediaApi from './media/mediaApi'
//todo: fazer persistência / persistent reducer

export const store = configureStore({
  reducer: {
    //
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    //
    [orderApi.reducerPath]: orderApi.reducer,
    //
    [currentUserApi.reducerPath]: currentUserApi.reducer,
    //
    [mediaApi.reducerPath]: mediaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      vehicleApi.middleware,
      orderApi.middleware,
      currentUserApi.middleware,
      mediaApi.middleware,
    ),
});
import { configureStore } from "@reduxjs/toolkit";
// import { counterSlice } from "./counter/slice";
import vehicleApi from "./vehicle/vehicleApi";
import { vehicleSlice } from "./vehicle/vehicleSlice";
//
import { currentUserApi } from './currentUserApi/currentUserApi';
import { currentUserSlice } from './currentUserApi/currentUserSlice'
//
import mediaApi from './media/mediaApi'

export const store = configureStore({
  reducer: {
    //
    vehicle: vehicleSlice.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    //
    currentUser: currentUserSlice.reducer,
    [currentUserApi.reducerPath]: currentUserApi.reducer,
    //
    [mediaApi.reducerPath]: mediaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      vehicleApi.middleware, 
      currentUserApi.middleware,
      mediaApi.middleware,
    ),
});

// import { configureStore } from '@reduxjs/toolkit'
// import counterReducer from './counter/counterSlice'
// import vehicleReducer from './vehicle/vehicleSlice-offline'

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//     vehicle: vehicleReducer,
//   },
// })
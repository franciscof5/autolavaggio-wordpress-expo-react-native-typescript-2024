import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import vehicleReducer from './vehicle/vehicleSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    vehicle: vehicleReducer,
  },
})
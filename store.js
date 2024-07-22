import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counter/counterSlice'
import vehicleReducer from './features/vehicle/vehicleSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    vehicle: vehicleReducer,
  },
})
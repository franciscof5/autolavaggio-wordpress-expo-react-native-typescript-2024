import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userInitialState } from "./initialState";

export const vehicleSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {},
});

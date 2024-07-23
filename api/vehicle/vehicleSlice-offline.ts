import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getVehicles = createAsyncThunk(
    "vehicleList/getVehicles", 
    async () => {
      try {
        const response = await axios.get(
          "https://www.lavaggioapp.it/wp-json/wp/v2/vehicle"
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
);

const initialState = {
    ID:0,
    "post_author":null,
    "post_date":"",
    "post_date_gmt":"",
    "post_content":"",
    "post_title":"",
    "post_excerpt":"",
    "post_status":"",
    "comment_status":"",
    "ping_status":"",
    "post_password":"",
    "post_name":"Macchina Name",
    "to_ping":"",
    "pinged":"",
    "post_modified":"",
    "post_modified_gmt":"",
    "post_content_filtered":"",
    "post_parent":0,
    "guid":"",
    "menu_order":0,
    "post_type":"",
    "post_mime_type":"",
    "comment_count":"",
    "filter":"",
    "title": {
      "rendered": "loading... ..."
    }
}

export const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
      increment: (state) => {
        state.ID += 1
      },
      decrement: (state) => {
        state.ID -= 1
      },
      incrementByAmount: (state, action) => {
        state.ID += action.payload
      },
    },
    // extraReducers: (builder) => {
    //     builder
    //       .addCase(getVehicles.pending, (state, action) => {
    //       state.isLoading = true;
    //       state.hasError = false;
    //     })
    //       .addCase(getVehicles.fulfilled, (state, action) => {
    //         state.ID = action.payload;
    //         state.isLoading = false;
    //         state.hasError = false
    //       })
    //       .addCase(getVehicles.rejected, (state, action) => {
    //         state.hasError = true
    //         state.isLoading = false;
    //       })
    //   }
})

// Selectors
export const selectCompanies = state => state.companyList.company;
export const selectLoadingState = state => state.companyList.isLoading;
export const selectErrorState = state => state.companyList.hasError;


// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = vehicleSlice.actions

export default vehicleSlice.reducer
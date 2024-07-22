import { createSlice } from '@reduxjs/toolkit'

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
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = vehicleSlice.actions

export default vehicleSlice.reducer
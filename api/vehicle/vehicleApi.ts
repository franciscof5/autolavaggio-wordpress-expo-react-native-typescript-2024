import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Vehicle } from "./interfaces/IVehicles";

const vehicleApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/" }),
  tagTypes: ["vehicle"],
  endpoints: (builder) => ({
    getVehicles: builder.query<Vehicle[], void>({
      query: () => "/vehicle",
      providesTags: ["vehicle"],
      transformResponse: (response: Vehicle[]) => {
        console.log("response vehicle: ", response[0]);
        return response.reverse();
      },
    }),
    getVehicleById: builder.query<Vehicle, number>({
      query: (id) => `/users/${id}`,
    }),
    addVehicle: builder.mutation<Vehicle, Vehicle>({
      query: (user) => ({
        url: "/vehicle",
        body: user,
        method: "POST",
      }),
      invalidatesTags: ["vehicle"],
    }),
    updateVehicle: builder.mutation<Vehicle, Vehicle>({
      query: (user) => ({
        url: `/vehicle/${user.id}`,
        body: user,
        method: "PATCH",
      }),
      invalidatesTags: ["vehicle"],
    }),
    deleteVehicle: builder.mutation<{}, number>({
      query: (id) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export default vehicleApi;

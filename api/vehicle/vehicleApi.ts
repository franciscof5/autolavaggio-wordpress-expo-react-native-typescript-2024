import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Vehicle } from "./interfaces/IVehicles";

const vehicleApi = createApi({
  reducerPath: "vehicleApi",
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
    getVehiclesByUserId: builder.query<Vehicle, number>({
      query: (id) => `/vehicle?author=${id}`,
      providesTags: ["vehicle"],
    }),
    // getVehicleById: builder.query<Vehicle, number>({
    //   query: (id) => `/users/${id}`,
    // }),
    addVehicle: builder.mutation({
      query: (vehicle) => ({
        url: "/vehicles",//?Accept=application%2Fjson&Content-Type=application%2Fjson&title=4%20From%20Inside%20Insonmia&status=publish",
        method: 'POST',
        params: vehicle,
        // {
        //   title: 'Direto da API2',
        //   status: 'publish'
        // },
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjE4NTM4MiwibmJmIjoxNzIyMTg1MzgyLCJleHAiOjE3MjI3OTAxODIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.RY52qyVoN2Ne_6EAudy-3Db0F7nR4qdqQZQhkP2xB5A'
        }
      }),
      invalidatesTags: ["vehicle"],
    }),
    // updateVehicle: builder.mutation<Vehicle, Vehicle>({
    //   query: (user) => ({
    //     url: `/vehicle/${user.id}`,
    //     body: user,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["vehicle"],
    // }),
    // deleteVehicle: builder.mutation<{}, number>({
    //   query: (id) => ({
    //     url: `/vehicle/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["vehicle"],
    // }),
  }),
});
// Auto-generated hooks
// export const { useAddVehicleMutation, useGetVehiclesByUserIdQuery, useGetVehiclesQuery } = vehicleApi
// Possible exports
// export const { endpoints, reducerPath, reducer, middleware } = vehicleApi
export default vehicleApi;

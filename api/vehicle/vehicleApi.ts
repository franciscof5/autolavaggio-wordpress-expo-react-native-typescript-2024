import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const vehicleApi = createApi({
  reducerPath: "vehicleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/",
    // headers: {
    //   Authorization: 'Bearer ' + global.TOKEN
    // }
  }),
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
      query (data) {
        console.log("getVehiclesByUserId =", data.token)
        return {
          url: `/vehicle?author=${data.id}&context=edit`,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + data.token
          },
        }
      },
      // query: (id) => `/vehicle?author=${id}&context=edit`,
      providesTags: ["vehicle"],
      // async onQueryStarted( console.log("d") ),
    }),

    // getVehiclesByUserId: builder.query({
    //   query(id) {
    //     console.log("getVehiclesByUserId: ", id)
    //     return {
    //       url: `/vehicle?author=${id}`,
    //     }
    //   },
    //   providesTags: ["vehicle"],
    // }),

    // getVehicleById: builder.query<Vehicle, number>({
    //   query: (id) => `/users/${id}`,
    // }),
    addVehicle: builder.mutation<any, any>({
      query(vehicle) {
        console.log("AddVech")
        return {
          url: "/vehicle",//?Accept=application%2Fjson&Content-Type=application%2Fjson&title=4%20From%20Inside%20Insonmia&status=publish",
          method: 'POST',
          params: vehicle,
          // data: {acf: {"vehicle_type":"ddd"}},
          // acf: {"vehicle_type":"eee"},
          // {
          //   title: 'Direto da API2',
          //   status: 'publish'
          // },
          headers: {
            Authorization: 'Bearer ' + vehicle.token
          }
        }
      },
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

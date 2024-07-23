import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Vehicle } from "./interfaces/IVehicles";

const vehicleApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/" }),
  tagTypes: ["vehicle"],
  endpoints: (builder) => ({
    getUsers: builder.query<Vehicle[], void>({
      query: () => "/vehicle",
      providesTags: ["vehicle"],
      transformResponse: (response: Vehicle[]) => {
        return response.reverse();
      },
    }),
    getUserById: builder.query<Vehicle, number>({
      query: (id) => `/users/${id}`,
    }),
    addUser: builder.mutation<Vehicle, Vehicle>({
      query: (user) => ({
        url: "/vehicle",
        body: user,
        method: "POST",
      }),
      invalidatesTags: ["vehicle"],
    }),
    updateUser: builder.mutation<Vehicle, Vehicle>({
      query: (user) => ({
        url: `/vehicle/${user.id}`,
        body: user,
        method: "PATCH",
      }),
      invalidatesTags: ["vehicle"],
    }),
    deleteUser: builder.mutation<{}, number>({
      query: (id) => ({
        url: `/vehicle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export default vehicleApi;

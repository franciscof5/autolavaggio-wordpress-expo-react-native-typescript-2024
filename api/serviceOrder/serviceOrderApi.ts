import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const serviceOrderApi = createApi({
  reducerPath: "serviceOrderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/",
    // headers: {
    //   Authorization: 'Bearer ' + global.TOKEN
    // }
  }),
  tagTypes: ["service_order"],
  endpoints: (builder) => ({
    getServiceOrders: builder.query<any, any>({
      query: () => "/service_order",
      providesTags: ["service_order"],
      transformResponse: (response: Object[]) => {
        console.log("response service_order: ", response[0]);
        return response.reverse();
      },
    }),
    getServiceOrdersByUserId: builder.query<any, any>({
      query (data) {
        console.log("getServiceOrdersByUserId =", data.token)
        return {
          url: `/service_order?author=${data.id}&context=edit&status=pending`,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + data.token
          },
        }
      },
      providesTags: ["service_order"],
    }),

    addServiceOrder: builder.mutation<any, any>({
      query(serviceorder) {
        console.log("AddOder")
        return {
          url: "/service_order",//?Accept=application%2Fjson&Content-Type=application%2Fjson&title=4%20From%20Inside%20Insonmia&status=publish",
          method: 'POST',
          params: serviceorder,
          headers: {
            Authorization: 'Bearer ' + serviceorder.token
          }
        }
      },
      invalidatesTags: ["service_order"],
    }),
    // updateServiceOrder: builder.mutation<ServiceOrder, ServiceOrder>({
    //   query: (user) => ({
    //     url: `/serviceorder/${user.id}`,
    //     body: user,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["serviceorder"],
    // }),
    // deleteServiceOrder: builder.mutation<{}, number>({
    //   query: (id) => ({
    //     url: `/serviceorder/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["serviceorder"],
    // }),
  }),
});
// Auto-generated hooks
// export const { useAddServiceOrderMutation, useGetServiceOrdersByUserIdQuery, useGetServiceOrdersQuery } = serviceorderApi
// Possible exports
// export const { endpoints, reducerPath, reducer, middleware } = serviceorderApi
export default serviceOrderApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/",
    // headers: {
    //   Authorization: 'Bearer ' + global.TOKEN
    // }
  }),
  tagTypes: ["order"],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "/order",
      providesTags: ["order"],
      transformResponse: (response: Order[]) => {
        console.log("response order: ", response[0]);
        return response.reverse();
      },
    }),
    getOrdersByUserId: builder.query<Order, number>({
      query (data) {
        console.log("getOrdersByUserId =", data.token)
        return {
          url: `/order?author=${data.id}&context=edit`,
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + data.token
          },
        }
      },
      providesTags: ["order"],
    }),

    addOrder: builder.mutation<any, any>({
      query(order) {
        console.log("AddOder")
        return {
          url: "/order",//?Accept=application%2Fjson&Content-Type=application%2Fjson&title=4%20From%20Inside%20Insonmia&status=publish",
          method: 'POST',
          params: order,
          headers: {
            Authorization: 'Bearer ' + order.token
          }
        }
      },
      invalidatesTags: ["order"],
    }),
    // updateOrder: builder.mutation<Order, Order>({
    //   query: (user) => ({
    //     url: `/order/${user.id}`,
    //     body: user,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["order"],
    // }),
    // deleteOrder: builder.mutation<{}, number>({
    //   query: (id) => ({
    //     url: `/order/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["order"],
    // }),
  }),
});
// Auto-generated hooks
// export const { useAddOrderMutation, useGetOrdersByUserIdQuery, useGetOrdersQuery } = orderApi
// Possible exports
// export const { endpoints, reducerPath, reducer, middleware } = orderApi
export default orderApi;

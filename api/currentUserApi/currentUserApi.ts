import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const currentUserApi = createApi({
  reducerPath: "currentUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.lavaggioapp.it/wp-json/" }),
  endpoints: (builder) => ({
    login: builder.query({
      query: (name) => ({
        //method: "POST",
        url: `/`,
      })
      // ,
      // transformResponse: (response) => {
      //   console.log("currentUserApi transformResponse: ", response)
      //   //return response;
      // },
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: 'jwt-auth/v1/token?username='+data.username+'&password='+data.password,
        body: data,
        method: "POST",
      }),
    }),
    getFullUser: builder.mutation({
      query: (data) => ({
        url: 'wp/v2/users/me',
        headers: {
          Authorization: 'Bearer '+ data.token,
        },
        method: "POST",
      }),
    }),
  }),
});
// 
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// export const { useLoginQuery } = currentUserApi
export const { useLoginQuery, useLoginUserMutation, useGetFullUserMutation } = currentUserApi;

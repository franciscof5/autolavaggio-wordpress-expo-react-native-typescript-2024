import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.lavaggioapp.it/wp-json/wp/v2/" }),
  tagTypes: ["media"],
  endpoints: (builder) => ({
    getMedias: builder.query({
      query: () => "/media",
      providesTags: ["media"],
    }),
    getMediasByUserId: builder.query<Vehicle, number>({
      query: (id) => `/media?author=${id}`,
      providesTags: ["media"],
    }),
    // getVehicleById: builder.query<Vehicle, number>({
    //   query: (id) => `/users/${id}`,
    // }),
    addMedia: builder.mutation<{}, FormData>({
      query: (media) => {
        // const formData = new FormData();
        // formData.append("file", media.localUri);
        // console.log({ formData, media });
        //
        // var bodyFormData = new FormData();
        // bodyFormData.append('file', {
        //   uri: imageFileUri, 
        //   type: "image/jpeg",
        //   // name: imageFileUri?.split('/')[imageFileUri?.split('/').length - 1]
        // });
        return {
          // body: media,
          // formData:true,
          url: "/media",//?Accept=application%2Fjson&Content-Type=application%2Fjson&title=4%20From%20Inside%20Insonmia&status=publish",
          // method: 'POST',
          // params: {
          //   Accept: 'application/json',
          //   // body: formData,
          // },
          // headers: {
          //   cookie: 'PHPSESSID=efl5pir6pnfu61349l1p22ib7b',
          //   'Content-Type': 'image/jpeg',
          //   'User-Agent': 'insomnia/8.6.1',
          //   Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjE4NTM4MiwibmJmIjoxNzIyMTg1MzgyLCJleHAiOjE3MjI3OTAxODIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.RY52qyVoN2Ne_6EAudy-3Db0F7nR4qdqQZQhkP2xB5A',
          //   Accept: 'application/json',
          //   'Content-Disposition': 'attachment; filename="fsff.jpg"'
          // },
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
            'User-Agent': 'insomnia/8.6.1',
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d3dy5sYXZhZ2dpb2FwcC5pdCIsImlhdCI6MTcyMjE4NTM4MiwibmJmIjoxNzIyMTg1MzgyLCJleHAiOjE3MjI3OTAxODIsImRhdGEiOnsidXNlciI6eyJpZCI6IjE4OSJ9fX0.RY52qyVoN2Ne_6EAudy-3Db0F7nR4qdqQZQhkP2xB5A',
            Accept: 'application/json',
            'Content-Disposition': 'attachment; filename="fuzil.jpg"',
            cookie: 'PHPSESSID=efl5pir6pnfu61349l1p22ib7b; '
          },
          body: media
        }
        
        // data: media.localUri,
      },
      invalidatesTags: ["media"],
    }),
    // updateVehicle: builder.mutation<Vehicle, Vehicle>({
    //   query: (user) => ({
    //     url: `/media/${user.id}`,
    //     body: user,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["media"],
    // }),
    // deleteVehicle: builder.mutation<{}, number>({
    //   query: (id) => ({
    //     url: `/media/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["media"],
    // }),
  }),
});
// Auto-generated hooks
// export const { useAddVehicleMutation, useGetVehiclesByUserIdQuery, useGetVehiclesQuery } = mediaApi
// Possible exports
// export const { endpoints, reducerPath, reducer, middleware } = mediaApi
export default mediaApi;

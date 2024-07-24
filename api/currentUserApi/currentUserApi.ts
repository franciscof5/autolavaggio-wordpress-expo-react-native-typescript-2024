import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const currentUserApi = createApi({
  reducerPath: "currentUserApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://www.lavaggioapp.it/wp-json/jwt-auth/v1" }),
  endpoints: (builder) => ({
    login: builder.query({
      query: (name) => ({
        method: "POST",
        url: `/token?username=foca&password=931777`,
      })
      // ,
      // transformResponse: (response) => {
      //   console.log("currentUserApi transformResponse: ", response)
      //   //return response;
      // },
    }),
  }),
});
// 
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginQuery } = currentUserApi
/*
console.log("onSubmit")
    let datasend_login = {
      username: "foca",
      password: "931777"
    }
    axios.post("https://www.lavaggioapp.it/wp-json/jwt-auth/v1/token", datasend_login)
    .then((r)=> {
      let token = r.data.token;
      console.log("token", token);
      
      var options = {
        method: 'POST',
        url: 'https://www.lavaggioapp.it/wp-json/wp/v2/users/me',
        headers: {
          Authorization: 'Bearer ' + token,
        }
      };
      
      axios.request(options)
      .then(function (r2) {
          console.log(r2.data);
          console.log("r2.data", r2.data)
          LavaggioStore.update((s)=> {
            s.token = token;
            s.user = r2.data;
            let toast = Toast.show('Bem vindo ' + r2.data.username, { position: 0 });
          })
          navigation.navigate("HomeMap");
      }).catch(function (error) {
        let toast = Toast.show('Erro ao recuperar dados do usuário', { position: 0 });
        console.error(error);
      });

      // axios.post("https://autolavaggio.franciscomatelli.com.br/wp-json/wp/v2/users/me", datasend_tokenme)
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
    })
    .catch(function (error) {
      console.log(error);
    });
    */
//export default currentUserApi;

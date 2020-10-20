import axios from 'axios';
import config from './config/config';

const instance = axios.create({});

instance.defaults.baseURL = config.apiUrl;

instance.interceptors.request.use(
  config => {
    console.log('interceptando requisicao:', config);
    config.data = {
      ...config.data,
      curso: 'VueJS'
    };

    config.headers.common['Authorization'] = `Bearer token_jwt`;

    config.headers.put['Meu-cabecalho'] = 'Curso Vue JS';

    return config;
    // return new Promise((resolve, reject) => {
    //   console.log("Aguardando requisicao...");
    //   setTimeout(() => {
    //     console.log("Enviando requisicao...");
    //     resolve(config);
    //   }, 2000);
    // });
  },
  error => {
    console.log('erro ao fazer requisicao', error);
    return Promise.reject(error);
  }
);

// instance.interceptors.response.use(
// response => {
// console.log('Interceptando resposta...', response);

// if (Array.isArray(response.data)) {
//   respnse.data = response.data.slice(1, 3);
// }

// return response;
// },
// error => {
//   console.log('Erro capturado no interceptador de respostas: ', error);

//   return Promise.reject(error);
// }
// );

export default instance;

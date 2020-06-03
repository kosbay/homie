import axios from "axios";
import _ from "lodash";

export const API_URI = process.env.API_URI || "/api";

const request = axios.create({
  baseURL: API_URI
});

// request.interceptors.request.use(
//   config => {
//     config.headers.Authorization = `JWT ${store.getJWT()}`;

//     return config;
//   },
//   error => Promise.reject(error)
// );

request.interceptors.response.use(
  response => {
    return _.get(response, "data", response);
  },
  error => ({ message: _.get(error, "response.data", error) })
);

export default request as any;

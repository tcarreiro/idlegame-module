import { useApp } from "@/stores/app";
import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

export type QueryParam = string | number | boolean;

export type QueryParamSerializar = Record<string, QueryParam|QueryParam[]>;

export type ServiceException = {
  code: string;
  message: string;
  i18nMessage: string;
  originalError: string | object | AxiosError;
  httpStatus: number;
}

export type ExceptionResponse = {
  code: string;
  message: string;
}

const baseURL = "http://localhost:8081";

export const getAxios = () => {
  const { token, setToken, setUsername } = useApp();

  const createdAxios = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "pt-BR",
      "Authorization": `Bearer ${token}`
    },
  });

  createdAxios.interceptors.request.use((config)=> {
    config.params = config.params || {};
    return config;
  });

  createdAxios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {

      if (error.response?.status === 401 && !isTokenValid(token)) {
        try {
          // Chama o endpoint de refresh token
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true }, // para enviar o cookie HttpOnly do refresh token
          );

          const newToken = response.data.token;
          const newUser = response.data.username;
          if (newToken) {
            setToken(newToken); // atualiza o token no store
            setUsername(newUser);

            // Repetir a requisição original com o token novo
            if (error.config) {
              error.config.headers = error.config.headers || {};
              error.config.headers["Authorization"] = `Bearer ${newToken}`;
              return createdAxios.request(error.config);
            }
          }
        } catch (refreshError) {
          setToken("");
          setUsername("");
          // TODO: talvez redirecionar para login, etc
        }
      }
      return Promise.reject(error);
    }
  );

  createdAxios.interceptors.response.use(getAxiosResponse, handleServiceException);

  return createdAxios;
};

export const getAxiosResponse = (response: AxiosResponse) => {
  return response.data;
};

export const handleServiceException = (error: AxiosError) => {
  if (error.response) {
    const {code, message} = error?.response?.data as ExceptionResponse;

    const serviceException: ServiceException = {
      code: code ?? "unknown-error",
      message: message ?? "",
      i18nMessage: code ? `EXCEPTIONS.${code}` : "EXCEPTIONS.DEFAULT_ERROR",
      originalError: error,
      httpStatus: error.status ?? 0,
    };

    return Promise.reject(serviceException);
  }
  return Promise.reject(error);
};

const isTokenValid = (token:string) => {
  const decoded = jwtDecode(token);
  if (decoded.exp) {
    const decodedDate = new Date(0);
    decodedDate.setUTCSeconds(decoded.exp - 30);
    return new Date() < decodedDate;
  }
  return false;
}

export const paramsSerializer = (params: QueryParamSerializar) => {
  return Object.keys(params)
  .filter((key) => params[key])
  .map((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      return value.map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
      .join('&')
    }
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  })
  .join("&");
};

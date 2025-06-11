import axios, { AxiosError, type AxiosResponse } from "axios";

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

export const getAxios = () => {
  const createdAxios = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "pt-BR",
    },
  });

  createdAxios.interceptors.request.use((config)=> {
    config.params = config.params || {};
    return config;
  });

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

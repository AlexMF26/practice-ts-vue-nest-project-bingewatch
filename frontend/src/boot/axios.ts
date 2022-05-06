import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAlertStore } from '../stores/alert.store';
import { AlertType } from '../types/Alert';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default boot(({ app, store }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      let message = error?.response?.data?.message;
      if (error?.response?.data?.statusCode === 404) {
        return Promise.reject(error);
      }
      if (message === undefined) {
        useAlertStore(store).addAlert(
          'Something wrong happened',
          AlertType.Error,
          6000
        );
      } else if (Array.isArray(message)) {
        message = message
          .map((messageUnit) => {
            let m = messageUnit.trim();
            m = m.charAt(m.length - 1) === '.' ? m : m + '.';
            return m;
          })
          .join(' ');
        useAlertStore(store).addAlert(message, AlertType.Error, 6000);
      } else {
        message = message.trim();
        message =
          message.charAt(message.length - 1) === '.' ? message : message + '.';
        useAlertStore(store).addAlert(message, AlertType.Error, 6000);
      }
      return Promise.reject(error);
    }
  );
});

export { api };

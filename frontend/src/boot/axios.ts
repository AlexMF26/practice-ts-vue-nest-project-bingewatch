import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { useAlertsStore } from '../stores/alerts.store';
import { AlertType } from '../types/Alert';
import { i18n } from './i18n';
import { apiErrors } from '../i18n/en/apiErrors';

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

export default boot(({ app, store, router }) => {
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
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === undefined || statusCode === 500) {
          router.push('/unknown-error');
        } else if (statusCode === 401) {
          router.push('/unauthorized');
        } else if (statusCode === 404) {
          router.push('/not-found');
        } else {
          if (error.response?.data?.message == undefined) {
            router.push('/unknown-error');
          } else if (statusCode === 400) {
            if (error.response.data.message == apiErrors.badRequest.invalidId) {
              router.push('/not-found');
            } else {
              for (const [key, value] of Object.entries(apiErrors.badRequest)) {
                if (value === error.response.data.message) {
                  useAlertsStore(store).addAlert(
                    i18n.global.t(`apiErrors.badRequest.${key}`),
                    AlertType.Error,
                    6000
                  );
                  break;
                }
              }
            }
          } else if (statusCode === 403) {
            for (const [key, value] of Object.entries(apiErrors.forbidden)) {
              if (value === error.response.data.message) {
                useAlertsStore(store).addAlert(
                  i18n.global.t(`apiErrors.forbidden.${key}`),
                  AlertType.Error,
                  6000
                );
                break;
              }
            }
          } else if (statusCode === 409) {
            for (const [key, value] of Object.entries(apiErrors.conflict)) {
              if (value === error.response.data.message) {
                useAlertsStore(store).addAlert(
                  i18n.global.t(`apiErrors.conflict.${key}`),
                  AlertType.Error,
                  6000
                );
                break;
              }
            }
          } else if (statusCode === 503) {
            for (const [key, value] of Object.entries(
              apiErrors.serviceUnavailable
            )) {
              if (value === error.response.data.message) {
                useAlertsStore(store).addAlert(
                  i18n.global.t(`apiErrors.serviceUnavailable.${key}`),
                  AlertType.Error,
                  6000
                );
                break;
              }
            }
          }
        }
      } else {
        router.push('/unknown-error');
      }
      return Promise.reject(error);
    }
  );
});

export { api };

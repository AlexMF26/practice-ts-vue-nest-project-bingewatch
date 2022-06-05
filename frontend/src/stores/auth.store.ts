import { defineStore } from 'pinia';
import { LoginDto, SerializedUserEntity } from '../types/api/interface';
import jwt_decode from 'jwt-decode';
import { api } from '../boot/axios';
import { useAlertsStore } from './alerts.store';
import { AlertType } from '../types/Alert';
import { i18n } from '../boot/i18n';

export type AuthState = {
  loggedIn: boolean;
  isAdmin: boolean;
  expiration: number;
  userId: string;
  email: string;
  userName: string;
};

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      loggedIn: false,
      isAdmin: false,
      expiration: 0,
      userId: '',
      userName: '',
      email: '',
    } as AuthState),

  persist: true,

  actions: {
    logout() {
      this.$state = {
        loggedIn: false,
        isAdmin: false,
        expiration: 0,
        userId: '',
        userName: '',
        email: '',
      };
      useAlertsStore().addAlert(
        i18n.global.t('alerts.auth.logout'),
        AlertType.Success,
        2000
      );
    },

    expirationCheck() {
      if (this.loggedIn && this.expiration < Math.round(Date.now() / 1000)) {
        this.logout();
        return true;
      }
      return false;
    },

    canModify(resourceOwnerId: string) {
      if (this.loggedIn && this.userId === resourceOwnerId) {
        return true;
      }
      return false;
    },

    async getToken(loginInfo: LoginDto) {
      const loginResponse = await api.post<string>(
        '/authentification',
        loginInfo
      );
      const loginData = loginResponse.data;
      const jwtDecode: {
        exp: number;
        iat: number;
        id: string;
      } = jwt_decode(loginData);
      this.expiration = jwtDecode.exp;
    },

    async getDetails() {
      const userDetailsResponse = await api.get<SerializedUserEntity>(
        '/authentification/details'
      );
      const userDetailsData = userDetailsResponse.data;
      this.userId = userDetailsData.id;
      this.userName = userDetailsData.name;
      this.isAdmin = userDetailsData.role === 'ADMIN';
      this.email = userDetailsData.email;
    },

    async login(loginInfo: LoginDto) {
      await this.getToken(loginInfo);
      await this.getDetails();
      this.loggedIn = true;
      useAlertsStore().addAlert(
        i18n.global.t('alerts.auth.loginSuccess'),
        AlertType.Success,
        2000
      );
    },
  },
});

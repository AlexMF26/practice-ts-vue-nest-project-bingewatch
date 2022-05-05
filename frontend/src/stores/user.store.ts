import { defineStore } from 'pinia';
import {
  BearerTokenEntity,
  CreateUserDto,
  LoginDto,
  SerializedUserEntity,
  UpdateUserDto,
} from '../types/api/interface';
import jwt_decode from 'jwt-decode';
import { api } from '../boot/axios';
import { useAlertStore } from './alert.store';
import { AlertType } from '../types/Alert';

export type AuthState = {
  loggedIn: boolean;
  isAdmin: boolean;
  expiration: number;
  userId: string;
  email: string;
  userName: string;
};

export const useUserStore = defineStore('user', {
  state: () =>
    ({
      loggedIn: false,
      isAdmin: false,
      expiration: 0,
      userId: '',
      userName: '',
      email: '',
    } as AuthState),

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
    },

    expirationCheck() {
      if (this.loggedIn && this.expiration < Date.now()) {
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
      const loginResponse = await api.post<BearerTokenEntity>(
        '/authentification',
        loginInfo
      );
      const loginData = loginResponse.data;
      const jwtDecode: {
        exp: number;
        iat: number;
        id: string;
      } = jwt_decode(loginData.accessToken);
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
      const alertStore = useAlertStore();
      await this.getToken(loginInfo);
      await this.getDetails();
      this.loggedIn = true;
      alertStore.addAlert('You are now logged in', AlertType.Success, 2000);
    },

    async register(registerInfo: CreateUserDto) {
      const registerResponse = await api.post<SerializedUserEntity>(
        '/users',
        registerInfo
      );
      const registerData = registerResponse.data;
      return registerData;
    },

    async update(updateInfo: UpdateUserDto) {
      const updateResponse = await api.put<SerializedUserEntity>(
        '/users',
        updateInfo
      );
      const updateData = updateResponse.data;
      return updateData;
    },
  },
});

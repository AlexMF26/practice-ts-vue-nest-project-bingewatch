import { defineStore } from 'pinia';
import {
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
      useAlertStore().addAlert(
        'You are now logged in.',
        AlertType.Success,
        2000
      );
      console.log(this.expiration);
    },

    async register(registerInfo: CreateUserDto) {
      const registerResponse = await api.post<SerializedUserEntity>(
        '/users',
        registerInfo
      );
      const registerData = registerResponse.data;
      useAlertStore().addAlert(
        'You are now registered.',
        AlertType.Success,
        2000
      );
      return registerData;
    },

    async update(updateInfo: UpdateUserDto, id: string) {
      const updateResponse = await api.patch<SerializedUserEntity>(
        '/users/' + id,
        updateInfo
      );
      const updateData = updateResponse.data;
      useAlertStore().addAlert('Update successful.', AlertType.Success, 2000);
      return updateData;
    },

    async getUser(id: string) {
      const userResponse = await api.get<SerializedUserEntity>('/users/' + id);
      const userData = userResponse.data;
      useAlertStore().addAlert('Fetched user.', AlertType.Success, 2000);
      return userData;
    },
  },
});

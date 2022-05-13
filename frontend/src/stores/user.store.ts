import { defineStore } from 'pinia';
import {
  CreateUserDto,
  SerializedUserEntity,
  UpdateUserDto,
} from '../types/api/interface';
import { api } from '../boot/axios';
import { useAlertStore } from './alert.store';
import { AlertType } from '../types/Alert';

export const useUserStore = defineStore('user', {
  actions: {
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
      return userData;
    },
  },
});

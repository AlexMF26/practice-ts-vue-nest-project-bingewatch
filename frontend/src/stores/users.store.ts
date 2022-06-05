import { defineStore } from 'pinia';
import {
  CreateUserDto,
  SerializedUserEntity,
  UpdateUserDto,
} from '../types/api/interface';
import { api } from '../boot/axios';
import { useAlertsStore } from './alerts.store';
import { AlertType } from '../types/Alert';
import { i18n } from '../boot/i18n';

export const useUsersStore = defineStore('users', {
  actions: {
    async register(registerInfo: CreateUserDto) {
      const registerResponse = await api.post<SerializedUserEntity>(
        '/users',
        registerInfo
      );
      const registerData = registerResponse.data;
      useAlertsStore().addAlert(
        i18n.global.t('alerts.users.registerSuccess'),
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
      useAlertsStore().addAlert(
        i18n.global.t('alerts.users.updateSuccess'),
        AlertType.Success,
        2000
      );
      return updateData;
    },

    async getUser(id: string) {
      const userResponse = await api.get<SerializedUserEntity>('/users/' + id);
      const userData = userResponse.data;
      return userData;
    },
  },
});

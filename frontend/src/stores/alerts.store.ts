import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertType } from '../types/Alert';

export type AlertState = {
  alerts: Alert[];
};

export const useAlertsStore = defineStore('alerts', {
  state: () =>
    ({
      alerts: [],
    } as AlertState),

  actions: {
    addAlert(message: string, type: AlertType, timeout: number) {
      const id = uuidv4();
      this.alerts.push({
        id: id,
        message: message,
        type: type,
      });
      setTimeout(() => {
        this.removeAlert(id);
      }, timeout);
    },

    removeAlert(id: string) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
});

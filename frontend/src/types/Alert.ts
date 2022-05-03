export type Alert = {
  id: string;
  type: AlertType;
  message: string;
};

export enum AlertType {
  Success = 'success',
  Error = 'error',
}

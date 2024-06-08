export interface AppNotification {
  text: string;
  severity: NotificationSeverity;
}

export enum NotificationSeverity {
  OK = "OK",
  WARNING = "WARNING",
  ALERT = "ALERT"
}

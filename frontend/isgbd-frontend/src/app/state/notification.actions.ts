import { Action } from '@ngrx/store';
import { NotificationModel } from '../shared/models/notification.model';

export enum NotificationActionTypes {
  AddToNotification = '[Notification] Add to notifications',
  RemoveFromNotification = '[Notification] Remove from notification'
}

export class AddToNotification implements Action {
  readonly type = NotificationActionTypes.AddToNotification;
  constructor(public payload: NotificationModel) {
  }
}

export class RemoveFromNotification implements Action {
  readonly type = NotificationActionTypes.RemoveFromNotification;
  constructor(public payload: string) {
  }
}

export type NotifyActions = AddToNotification
 | RemoveFromNotification;

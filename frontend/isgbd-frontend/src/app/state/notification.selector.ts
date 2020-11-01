import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from './notification.state';
import { State } from './index';

export const selectNotificationState = createFeatureSelector<State, NotificationState>('notification');

export const getNotification = createSelector(
  selectNotificationState,
  state => state.notification
);
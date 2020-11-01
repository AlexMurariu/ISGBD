import { NotifyActions, NotificationActionTypes } from './notification.actions';
import { NotificationState } from './notification.state';

const initialState: NotificationState = {
  notification: null
};
export function notificationReducer(state: NotificationState = initialState, action: NotifyActions): NotificationState {
  switch (action.type) {
    case NotificationActionTypes.AddToNotification:
    {
      return {
        ...state,
        notification: action.payload
      };
    }
    case NotificationActionTypes.RemoveFromNotification:
    { 
      if (state.notification && state.notification.id === action.payload) {
        return {
          ...state,
          notification: null
        }
      }

      return state;
    }
    default:
      return state;
  }
}

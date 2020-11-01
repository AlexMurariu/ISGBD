import { ActionReducerMap } from '@ngrx/store';
import { notificationReducer } from './notification.reducer';
import { NotificationState } from './notification.state';
import { selectedDatabaseReducer } from './selected-database.reducer';
import { SelectedDatabaseState } from './selected-database.state';

export interface State {
    selectedDatabase: SelectedDatabaseState,
    notification: NotificationState,
}

export const reducers: ActionReducerMap<State> = {
    selectedDatabase: selectedDatabaseReducer,
    notification: notificationReducer
};
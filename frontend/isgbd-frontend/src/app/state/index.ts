import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
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

export function localStorageSyncReducer(reducer: ActionReducer<State>): ActionReducer<State> {
    return localStorageSync({
        keys: [
            { selectedDatabase: { encrypt: null, decrypt: null } }
        ], rehydrate: true, storage: sessionStorage
    })(reducer);
}

export const metaReducers: Array<MetaReducer<State, any>> = [localStorageSyncReducer];
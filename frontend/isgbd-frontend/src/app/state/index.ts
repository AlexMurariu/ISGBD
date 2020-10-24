import { ActionReducerMap } from '@ngrx/store';
import { selectedDatabaseReducer } from './selected-database.reducer';
import { SelectedDatabaseState } from './selected-database.state';

export interface State {
    selectedDatabase: SelectedDatabaseState
}

export const reducers: ActionReducerMap<State> = {
    selectedDatabase: selectedDatabaseReducer
};
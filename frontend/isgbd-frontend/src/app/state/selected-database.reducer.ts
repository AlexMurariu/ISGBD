import { act } from '@ngrx/effects';
import { SelectedDatabaseActions, SelectedDatabaseActionTypes } from './selected-database.actions';
import { SelectedDatabaseState } from './selected-database.state';

const initialState: SelectedDatabaseState = {
    selectedDatabase: '',
    error: ''
}

export function selectedDatabaseReducer(state = initialState, action: SelectedDatabaseActions): SelectedDatabaseState {
    switch(action.type) {
        case SelectedDatabaseActionTypes.SelectDatabase:
            return {
                ...state,
                selectedDatabase: action.payload
            };
        
        case SelectedDatabaseActionTypes.ClearSelectedDatabase:
            return {
                ...state,
                selectedDatabase: ''
            };

        default:
            return state;
    }
}
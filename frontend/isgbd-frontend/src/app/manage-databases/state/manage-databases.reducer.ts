import { ManageDatabasesActions, ManageDatabasesActionTypes } from './manage-databases.actions';
import { ManageDatabasesState } from './manage-databases.state';

const initialState: ManageDatabasesState = {
    databaseList: null,
    error: ''
};

export function reducer(state = initialState, action: ManageDatabasesActions): ManageDatabasesState {
    switch(action.type) {
        case ManageDatabasesActionTypes.GetDatabasesSuccess: 
            return {
                databaseList: action.payload,
                error: ''
            };

        case ManageDatabasesActionTypes.GetDatabasesFail:
            return {
                databaseList: null,
                error: action.payload
            }

        default:
            return state;
    }
}
import { ManageDatabasesActions, ManageDatabasesActionTypes } from './manage-databases.actions';
import { ManageDatabasesState } from './manage-databases.state';

const initialState: ManageDatabasesState = {
    databaseList: null,
    databaseIsLoading: false,
    error: ''
};

export function reducer(state = initialState, action: ManageDatabasesActions): ManageDatabasesState {
    switch(action.type) {
        case ManageDatabasesActionTypes.GetDatabases:
            return {
                ...state,
                databaseIsLoading: true
            }
        case ManageDatabasesActionTypes.GetDatabasesSuccess: 
            return {
                databaseList: action.payload,
                databaseIsLoading: false,
                error: ''
            };

        case ManageDatabasesActionTypes.GetDatabasesFail:
            return {
                databaseList: [],
                databaseIsLoading: false,
                error: action.payload
            }

        default:
            return state;
    }
}
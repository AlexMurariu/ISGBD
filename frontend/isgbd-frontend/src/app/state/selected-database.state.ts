import { TableModel } from '../shared/models';

export interface SelectedDatabaseState {
    selectedDatabase: string;
    tables?: TableModel[];
    error: string;
}
import { TableModel } from 'src/app/shared/models';

export interface ViewDatabaseState {
    tablesList: TableModel[];
    tablesListIsLoading: boolean;
    error: string;
}
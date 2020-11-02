import { TableModel } from '.';

export interface IDatabaseModel {
    dataBaseName: string;
    tables: TableModel[];
}

export class DatabaseModel implements IDatabaseModel {
    dataBaseName: string;
    tables: TableModel[];

    constructor(params: IDatabaseModel) {
        this.dataBaseName = params.dataBaseName;
        this.tables = params.tables || [];
    }
}
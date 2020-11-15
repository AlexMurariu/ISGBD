import { ForeignKeyModel } from './foreignKey.model';
import { IndexModel } from './index.model';
import { AttributeModel } from './attribute.model';

export interface ITableModel {
    tableName: string;
    fileName: string;
    rowLength: number;
    attributes: AttributeModel[];
    primaryKey: string;
    foreignKeys: ForeignKeyModel[];
    indexFiles: IndexModel[];
}

export class TableModel implements TableModel {
    tableName: string;
    fileName: string;
    rowLength: number;
    attributes: AttributeModel[];
    primaryKey: string;
    foreignKeys: ForeignKeyModel[];
    indexFiles: IndexModel[];

    constructor(params: ITableModel) {
        this.tableName = params.tableName;
        this.fileName = params.fileName;
        this.rowLength = params.rowLength;
        this.attributes = params.attributes || [];
        this.primaryKey = params.primaryKey;
        this.foreignKeys = params.foreignKeys || [];
        this.indexFiles = params.indexFiles || [];
    }
}
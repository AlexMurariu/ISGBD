const findInDatabaseList = (array, databaseName) => {
    return array.findIndex((database) => {
        if (database.dataBaseName === databaseName) {
            return true;
        }
        return false;
    });
}

const findInTableList = (array, tableName) => {
    return array.findIndex((table) => {
        if (table.tableName === tableName) {
            return true;
        }
        return false;
    });
}

const findInIndexList = (array, indexName) => {
    return array.findIndex((index) => {
        if (index.indexName === indexName) {
            return true;
        }
        return false;
    });
}

const findInAttrList = (array, attrName) => {
    return array.findIndex((attr) => {
        if (attr.attributeName === attrName) {
            return true;
        }
        return false;
    });
}

module.exports = { findInDatabaseList, findInTableList, findInIndexList, findInAttrList }
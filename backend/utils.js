const { getDatabasesFromDB } = require("./dbFunctions");

const findItemInList = (array, prop, value) => {
    return array.findIndex((database) => {
        if (database[prop] === value) {
            return true;
        }
        return false;
    });
}

const canInsertRecordWithUniqueValue = (attributes, value, records) => {
    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].isUnique === "1") {
            const values = value.split('#');

            for (let j = 0; j < records.length; j++) {
                const recordValues = records[j].value.split("#");
                
                if (values[i] === recordValues[i]) {
                    return false;
                }
            }
        }
    }
    
    return true
}

const canInsertRecordWithPrimaryKey = (value, records) => {
    for (let i = 0; i < records.length; i++) {
        if (value === records[i].key) {
            return false;
        }
    } 
    return true;
}

async function canInsertWithForeignKeyValue(databaseName, foreignKeys, value, tables) {
    if (!foreignKeys.length) {
        return true;
    }

    let goodValue = false;
    const values = value.split('#');

    for (let i = 0; i < foreignKeys.length; i++) {
        for (let j = 0; j < tables.length; j++) {
            if (tables[j].tableName === foreignKeys[i].referencedTableName) {
                const refferencedTableData = await getDatabasesFromDB(databaseName, tables[j].tableName);
                
                for (let k = 0; k < refferencedTableData.length; k++) {
                    let recordValues = refferencedTableData[k].value.split('#');
                    recordValues.push(refferencedTableData[k].key);
                    
                    for (let m = 0; m < values.length; m++) {
                        if (recordValues.findIndex(foundValue => foundValue === values[m]) !== -1) {
                            goodValue = true;
                            break;
                        }
                    }
                }
            }       
        }
    }

    return goodValue;
}

async function isReferencedByForeignKey(databaseName, referencedTable, tablesList) {
    let isReferenced = false;

    for (let i = 0; i < tablesList.length; i++) {
        if (referencedTable.tableName !== tablesList[i].tableName) {
            const refferencedTableData = await getDatabasesFromDB(databaseName, referencedTable.tableName);

            if (!refferencedTableData.length) {
                isReferenced = false;
            }

            for (let j = 0; j < tablesList[i].foreignKeys.length; j++) {
                if (tablesList[i].foreignKeys[j].referencedTableName === referencedTable.tableName) {
                    isReferenced = true;
                    break;
                }
            }

            if (isReferenced) {
                break;
            }
        }
    }

    return isReferenced;
}

const processData = (data) => {
    const processedData = data.map(element => {
        let valueArray = [];
        valueArray.push(element.key);

        const values = element.value.split('#');
        valueArray = valueArray.concat(values);
        
        return valueArray
    });

    return processedData;
} 

module.exports = { 
    findItemInList,
    canInsertRecordWithUniqueValue,
    canInsertRecordWithPrimaryKey,
    isReferencedByForeignKey,
    processData,
    canInsertWithForeignKeyValue
}
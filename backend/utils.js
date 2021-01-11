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

const isReferencedByForeignKey = (referencedTable, tablesList) => {
    let isReferenced = false;
    tablesList.forEach(table => {
        if (referencedTable.tableName !== table.tableName) {
            table.foreignKeys.forEach(foreignKey => {
                if (foreignKey.referencedTableName === referencedTable.tableName) {
                    isReferenced = true;
                    return;
                }
            })
        }
        if (isReferenced) {
            return;
        }
    })

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
    processData
}
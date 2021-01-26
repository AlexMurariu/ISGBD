const findItemInList = (array, prop, value) => {
    return array.findIndex((database) => {
        if (database[prop] === value) {
            return true;
        }
        return false;
    });
}

const canInsertRecordWithPrimaryKey = (value, records) => {
    for (let i = 0; i < records.length; i++) {
        if (value === records[i].key) {
            return false;
        }
    } 
    return true;
}

const isForeignKey = (attributeName, foreignKeyList) => {
    return foreignKeyList.find(foreignKey => foreignKey.attributeName === attributeName);
}

const isUniqueAttribute = (attributeName, attributeList) => {
    return attributeList.find(attribute => attribute.attributeName === attributeName).isUnique;
}

const generateIndexData = (data, indexPosition, isForeign, isUnique) => {
    let values = [];

    if (isForeign) {
        for (let i = 0; i < data.length; i++) {
            let indexValues = [];
            const valuesI = data[i].value.split('#');
            const foreignKeyValueI = valuesI[indexPosition];

            const valueExists = values.find(indexRecord => indexRecord.key === foreignKeyValueI);

            if (!valueExists) {

                
                for (let j = 0; j < data.length; j++) {
                    const valuesJ = data[j].value.split('#');
                    const foreignKeyValueJ = valuesJ[indexPosition];
                    
                    if (foreignKeyValueI === foreignKeyValueJ) {
                        indexValues.push(data[j].key);
                    }
                }

                values.push({key: foreignKeyValueI, value: indexValues});
            }
        }
    } else if (isUnique) {
        for (let i = 0; i < data.length; i++) {
            const recordValues = data[i].value.split('#');
            const foreignKeyValue = recordValues[indexPosition];

            values.push({key: foreignKeyValue, value: data[i].key});
        }
    }

    return values;
}

const getIndexPositionFromAttributeList = (attributeName, attributeList) => {
    return attributeList.findIndex(attribute => attribute.attributeName === attributeName);
}

const foreignKeyValueExists = async (parentTableData, foreignKey, insertedRecordValue, attributeList, primaryKeysLength) => {
    const values = insertedRecordValue.value.split('#');
    let valueExists = false;

    const foreignKeyPosition = getIndexPositionFromAttributeList(foreignKey.attributeName, attributeList) - primaryKeysLength;
    
    if (parentTableData.find(record => record.key === values[foreignKeyPosition])) {
        valueExists = true;
    }
    
    return valueExists;
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
    canInsertRecordWithPrimaryKey,
    isForeignKey,
    isUniqueAttribute,
    generateIndexData,
    getIndexPositionFromAttributeList,
    foreignKeyValueExists,
    processData
}
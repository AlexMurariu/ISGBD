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
        console.log(attributes[i].isUnique);
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

module.exports = { 
    findItemInList,
    canInsertRecordWithUniqueValue,
    canInsertRecordWithPrimaryKey
}
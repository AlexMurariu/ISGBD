const findItemInList = (array, prop, value) => {
    return array.findIndex((database) => {
        if (database[prop] === value) {
            return true;
        }
        return false;
    });
}

module.exports = { findItemInList }
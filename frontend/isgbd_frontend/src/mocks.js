export const mockedDatabase = {
    dataBaseName: "Plants",
    tables: []
}

export const mockedTable = {
    tableName: "Flowers",
    fileName: "flowers.kv",
    rowLength: 120,
    attributes: [
      {
        attributeName: "id_flower",
        type: "varchar",
        length: 255,
        isnull: 0
      },
      {
        attributeName: "name",
        type: "varchar",
        length: 255,
        isnull: 0
      }
    ],
    primaryKey: {
      pkAttribute: "id_flower"
    },
    indexFiles: []
}

export const mockedIndex = {
    indexName: "name.ind",
    keyLength: 25,
    isUnique: 0,
    indexType: "BTree",
    indexAttributes: {
        IAttribute: "name"
    }
}
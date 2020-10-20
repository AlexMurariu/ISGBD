class DatabaseService {
    baseUrl = 'http://localhost:3001/database';

    getDatabase() {
        return fetch(this.baseUrl).then(response => response.json());
    }

    createDatabase(database) {
        fetch(this.baseUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(database)
        })
    }

    deleteDatabase(databaseName) {
        const url = `${this.baseUrl}/${databaseName}`;
        fetch(url, {
            method: 'DELETE'
        });
    }
}

export const databaseService = new DatabaseService();
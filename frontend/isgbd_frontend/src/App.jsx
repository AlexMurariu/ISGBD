import React from 'react';
import './App.css';
import { mockedDatabase } from './mocks';
import { databaseService } from './service';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  getDatabase() {
    databaseService.getDatabase().then(resp => console.log(resp));
  }

  createDatabase() {
    databaseService.createDatabase(mockedDatabase);
  }

  deleteDatabase() {
    databaseService.deleteDatabase(mockedDatabase.dataBaseName);
  }

  render() {

    return (
      <div className="App">
        <button onClick={() => this.getDatabase()}>Get database</button>
        <button onClick={() => this.createDatabase()}>Create database</button>
        <button onClick={() => this.deleteDatabase()}>Drop database</button>
      </div>
    );
  }
}

export default App;

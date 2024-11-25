// src/App.js
import React from 'react';
import './App.css';
import WrappedComponent from './Components/DataFetcher';
import Login from './Components/Login';

function App() {
  const isAuthenticated = sessionStorage.getItem('accessToken');

  return (
    <div className="App">
      <header className="App-header">
        {isAuthenticated ? <WrappedComponent /> : <Login />}
      </header>
    </div>
  );
}

export default App;
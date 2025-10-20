import React, { useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <HomePage onLogout={handleLogout} />
      ) : (
        <>
          <h1 className="main-title">Gia phả họ Lương</h1>
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
}

export default App;
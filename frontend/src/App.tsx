import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TruckProvider } from './context/TruckContext';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TruckProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard userType="normal_user" />} />
          </Routes>
        </TruckProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
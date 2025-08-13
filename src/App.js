import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';

import Callback from './views/criipto/Callback';

import Dashboard from './views/velia/Dashboard';
import AuthenticationController from './controllers/AuthenticationController';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Login' element={<Login />} />

      <Route path='/criipto/callback' element={<Callback />} />
      <Route path='/controllers/authenticate' element={<AuthenticationController />} />

      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

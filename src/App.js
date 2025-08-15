import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './views/Home';
import Login from './views/Login';

import Callback from './views/criipto/Callback';

import Dashboard from './views/velia/Dashboard';
import AuthenticationController from './controllers/AuthenticationController';
import { useAuth } from './context/AuthContext';
import { bindAuthHelpers } from './lib/axiosClient';
import DashboardGroups from './views/velia/realtor/DashboardGroups';
import DashboardGroupsCreate from './views/velia/realtor/DashboardGroupsCreate';

export default function App() {
  const auth = useAuth();

  bindAuthHelpers({
    getValidAccessToken: auth.getValidAccessToken,
    onUnauthorized: auth.logout
  });

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Login' element={<Login />} />

      <Route path='/criipto/callback' element={<Callback />} />
      <Route path='/controllers/authenticate' element={<AuthenticationController />} />

      <Route path='/dashboard' element={<Dashboard />} >
        <Route path='groups' element={<DashboardGroups />} />
        <Route path='groups/create' element={<DashboardGroupsCreate />} />
        <Route path='groups/create/:id' element={<DashboardGroupsCreate />} />
      </Route>
    </Routes>
  )
}

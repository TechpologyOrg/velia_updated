import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './views/Dashboard';
import Login from './views/Login';

import Callback from './views/criipto/Callback';

import VeliaDashboard from './views/velia/Dashboard';
import AuthenticationController from './controllers/AuthenticationController';
import { useAuth } from './context/AuthContext';
import { bindAuthHelpers } from './lib/axiosClient';
import DashboardGroups from './views/velia/realtor/DashboardGroups';
import DashboardGroupsCreate from './views/velia/realtor/DashboardGroupsCreate';
import DashboardGroupView from './views/velia/realtor/DashboardGroupView';
import ViewForm from './views/customer/ViewForm';

import CustomerAuthenticationController from './controllers/CustomerAuthenticationController';
import CustomerLogin from './views/velia/customer/CustomerLogin';
import CustomerDashboard from './views/velia/customer/CustomerDashboard';
import CustomerDashboardHome from './views/velia/customer/CustomerDashboardHome';

export default function App() {
  const auth = useAuth();

  // Bind auth helpers only once when the component mounts
  useEffect(() => {
    bindAuthHelpers({
      getValidAccessToken: auth.getValidAccessToken,
      onUnauthorized: auth.logout
    });
  }, [auth.getValidAccessToken, auth.logout]);

  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/Login' element={<Login />} />

      <Route path='/criipto/callback' element={<Callback />} />
      <Route path='/controllers/authenticate' element={<AuthenticationController />} />
      <Route path='/controllers/customer/authenticate' element={<CustomerAuthenticationController />} />

      <Route path='/dashboard' element={<VeliaDashboard />} >
        <Route path='groups' element={<DashboardGroups />} />
        <Route path='groups/:id' element={<DashboardGroupView />} />
        <Route path='groups/create' element={<DashboardGroupsCreate />} />
        <Route path='groups/update/:id' element={<DashboardGroupsCreate />} />
      </Route>

      <Route path="/:string/customer/login" element={<CustomerLogin />} />

      <Route path="/:string/customer/dashboard" element={<CustomerDashboard />} >
        <Route path='home' element={<CustomerDashboardHome />} />
        <Route path='task/:id' element={<ViewForm />} />
      </Route>

      <Route path='/customer/view-form' element={<ViewForm />} />
    </Routes>
  )
}

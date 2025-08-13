import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const REFRESH_STORAGE_KEY = 'velia_refresh_token';

export default function AuthenticationController() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const auth = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const idToken = state?.idToken || sessionStorage.getItem('id_token');
        if (!idToken) throw new Error('Missing id_token from BankID flow');

        const response = await axios.post(
          '/auth/bankid/login/',
          { id_token: idToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        console.log('Authentication response:', response.data);

        const { access, refresh, user } = response.data || {};
        if (!access || !refresh) throw new Error('Invalid login response (missing tokens)');

        // Store refresh token
        sessionStorage.setItem(REFRESH_STORAGE_KEY, refresh);

        // Update context
        if (typeof auth?.login === 'function') {
          await auth.login({ access, refresh, user });
        } else if (typeof auth?.setUser === 'function') {
          auth.setUser({
            name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || user?.email,
            ssn: user?.personnummer,
            idToken,
            accessToken: access
          });
        }

        // Clean up
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('claims');

        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Authentication failed. Please try again.');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('claims');
        navigate('/Login', { replace: true });
      }
    };

    run();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p className="text-[32px] bg-blue-400 px-4 py-2 rounded">
        {error || 'Authenticating...'}
      </p>
    </div>
  );
}
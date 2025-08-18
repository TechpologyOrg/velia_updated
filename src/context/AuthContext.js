import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const REFRESH_ENDPOINT = 'https://api.velia.se/api/token/refresh/';
const LOGOUT_ENDPOINT  = 'https://api.velia.se/api/v1/auth/logout';
const STORAGE_KEY = 'velia_refresh_token';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch { return null; }
}
function msUntilExpiry(token) {
  const p = parseJwt(token);
  if (!p?.exp) return -1;
  const now = Math.floor(Date.now()/1000);
  return (p.exp - now) * 1000;
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshInFlight = useRef(null);
  const refreshTimerId = useRef(null);

  // Rehydrate on load using refresh token
  useEffect(() => {
    (async () => {
      console.log('AuthContext: Starting rehydration...');
      const rt = sessionStorage.getItem(STORAGE_KEY);
      if (!rt) { 
        console.log('AuthContext: No refresh token found, setting loading to false');
        setLoading(false); 
        return; 
      }
      try {
        console.log('AuthContext: Refresh token found, attempting refresh...');
        const at = await refreshAccessToken(rt);
        if (at) {
          console.log('AuthContext: Refresh successful, hydrating...');
          hydrateFromAccessToken(at);
        }
      } catch (error) {
        console.error('AuthContext: Refresh failed during rehydration:', error);
        sessionStorage.removeItem(STORAGE_KEY);
      } finally {
        console.log('AuthContext: Rehydration complete, setting loading to false');
        setLoading(false);
      }
    })();
    return () => clearTimeout(refreshTimerId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function hydrateFromAccessToken(token, fallbackUser) {
    console.log('AuthContext: Hydrating with token:', token ? 'valid' : 'null');
    setAccessToken(token);
    const claims = parseJwt(token) || {};
    // Prefer server user if provided, else map minimal claims
    setUser(fallbackUser ?? {
      sub: claims.sub,
      name: claims.name,
      ssn:  claims.ssn,
      email: claims.email
    });
    scheduleRefresh(token);
    console.log('AuthContext: Hydration complete, accessToken set');
  }

  function scheduleRefresh(token) {
    clearTimeout(refreshTimerId.current);
    const ms = msUntilExpiry(token);
    const when = Math.max(ms - 30_000, 1_000); // 30s before expiry
    refreshTimerId.current = setTimeout(() => {
      const rt = sessionStorage.getItem(STORAGE_KEY);
      if (!rt) return logout();
      refreshAccessToken(rt).catch(() => logout());
    }, when);
  }

  async function refreshAccessToken(refreshToken) {
    if (refreshInFlight.current) return refreshInFlight.current;

    refreshInFlight.current = (async () => {
      const res = await fetch(REFRESH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh: refreshToken
        })
      });
      refreshInFlight.current = null;

      if (!res.ok) throw new Error('Refresh failed');
      const json = await res.json();
      const at = json?.access;  // Django key name
      const rt = json?.refresh; // Django key name
      if (!at) throw new Error('No access token');

      if (rt) sessionStorage.setItem(STORAGE_KEY, rt);
      setAccessToken(at);
      scheduleRefresh(at);
      return at;
    })();

    return refreshInFlight.current;
  }

  const login = useCallback(async ({ access, refresh, user: serverUser }) => {
    // Call this after your AuthenticationController hits Django and gets tokens
    if (!access || !refresh) throw new Error('Missing tokens');
    sessionStorage.setItem(STORAGE_KEY, refresh);
    hydrateFromAccessToken(access, serverUser);
  }, []);

  const logout = useCallback(async () => {
    try { await fetch(LOGOUT_ENDPOINT, { method: 'POST' }); } catch {}
    sessionStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
    clearTimeout(refreshTimerId.current);
  }, []);

  const getValidAccessToken = useCallback(async () => {
    // If no access token but we have a refresh token, try to refresh
    if (!accessToken) {
      const rt = sessionStorage.getItem(STORAGE_KEY);
      if (rt) {
        try {
          console.log('No access token, attempting refresh...');
          const newToken = await refreshAccessToken(rt);
          console.log('Refresh successful, new token:', newToken ? 'valid' : 'null');
          return newToken;
        } catch (error) {
          console.error('Refresh failed:', error);
          await logout();
          return null;
        }
      }
      console.log('No access token and no refresh token available');
      return null;
    }
    
    // If access token is expiring soon, refresh it
    if (msUntilExpiry(accessToken) <= 10_000) {
      const rt = sessionStorage.getItem(STORAGE_KEY);
      if (!rt) { await logout(); return null; }
      try { return await refreshAccessToken(rt); }
      catch { await logout(); return null; }
    }
    return accessToken;
  }, [accessToken, logout]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!accessToken,
      loading,
      login,
      logout,
      getValidAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
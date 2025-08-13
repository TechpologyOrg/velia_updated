import { getAuth } from './getAuthInstance';

export async function apiFetch(url, options = {}) {
  const auth = getAuth();
  let token = await auth.getValidAccessToken();

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // One retry after refresh
    const refreshed = await auth.getValidAccessToken();
    if (!refreshed) {
      await auth.logout();
      throw new Error('Unauthorized');
    }
    headers.set('Authorization', `Bearer ${refreshed}`);
    res = await fetch(url, { ...options, headers });
  }

  return res;
}
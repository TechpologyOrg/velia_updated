import { useAuth } from '../context/AuthContext';
let authSnapshot = null;
export function AuthWatcher() {
  authSnapshot = useAuth();
  return null;
}
export function getAuth() {
  if (!authSnapshot) throw new Error('Auth not initialized');
  return authSnapshot;
}
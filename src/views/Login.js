import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCriiptoVerify } from '@criipto/verify-react'
import { useAuth } from '../context/AuthContext'

import V_Input from '../components/V_Input'

export default function Login() {
    const navigate = useNavigate();
    const { setUser, isAuthenticated, loading } = useAuth();

    const { loginWithRedirect, result, claims, isLoading, error } = useCriiptoVerify();

    const [submitting, setSubmitting] = useState(false);

    // Check if user is already authenticated and redirect to dashboard
    useEffect(() => {
        if (!loading && isAuthenticated) {
            console.log('User already authenticated, redirecting to dashboard');
            navigate('/dashboard/groups', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // Also check sessionStorage as a fallback
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const user = sessionStorage.getItem('user');
            const refreshToken = sessionStorage.getItem('velia_refresh_token');
            
            if (user && refreshToken) {
                console.log('Session found in storage, redirecting to dashboard');
                navigate('/dashboard/groups', { replace: true });
            }
        }
    }, [loading, isAuthenticated, navigate]);

    const startBankIdLogin = async (thisDevice = false) => {
        sessionStorage.setItem('returnTo', '/controllers/authenticate');

        await loginWithRedirect({
            acr_values: thisDevice ? "urn:grn:authn:se:bankid:same-device" : "urn:grn:authn:se:bankid:another-device:qr"
        })
    }

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="flex flex-col w-full h-screen items-center justify-center">
                <div className="w-[400px] min-h-[280px] px-12 py-8 flex flex-col items-center justify-center bg-white rounded-lg border-2 border-blue-400">
                    <p className="text-[24px] text-blue-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render login form if user is authenticated (will redirect)
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-col w-full h-screen items-center justify-center">
            <div className="w-[400px] min-h-[280px] px-12 py-8 flex flex-col items-center justify-center bg-white rounded-lg border-2 border-blue-400">
                <p className="text-[24px] text-blue-400">Login</p>
                <button onClick={startBankIdLogin} disabled={submitting}>
                    Verify with BankID
                </button>

                {error && (
                    <p className="text-red-500 mt-4">Error: {error.error} ({error.error_description})</p>
                )}
            </div>
        </div>
    )
}

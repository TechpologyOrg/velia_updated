import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCriiptoVerify } from '@criipto/verify-react'
import { useAuth } from '../../../context/AuthContext'

import V_Input from '../../../components/V_Input'

export default function CustomerLogin() {
    const navigate = useNavigate();
    const { setUser, isAuthenticated, loading } = useAuth();

    const { loginWithRedirect, result, claims, isLoading, error } = useCriiptoVerify();

    const [submitting, setSubmitting] = useState(false);

    // Check if user is already authenticated and redirect to customer dashboard
    useEffect(() => {
        if (!loading && isAuthenticated) {
            const organisationName = window.location.pathname.split('/')[1];
            console.log('User already authenticated, redirecting to customer dashboard');
            navigate(`/${organisationName}/customer/dashboard/home`, { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // Also check sessionStorage as a fallback
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            const user = sessionStorage.getItem('user');
            const refreshToken = sessionStorage.getItem('velia_refresh_token');
            
            if (user && refreshToken) {
                const organisationName = window.location.pathname.split('/')[1];
                console.log('Session found in storage, redirecting to customer dashboard');
                navigate(`/${organisationName}/customer/dashboard/home`, { replace: true });
            }
        }
    }, [loading, isAuthenticated, navigate]);

    const startBankIdLogin = async (thisDevice = false) => {
        const searchParams = new URLSearchParams(window.location.search);
        const organisationId = searchParams.get('oid');
        const organisationName = window.location.pathname.split('/')[1];

        // No, use & to separate query parameters, not ;
        sessionStorage.setItem('returnTo', `/controllers/customer/authenticate?oid=${organisationId}&organisation=${organisationName}`);

        console.log("Organisation ID:", organisationId);
        console.log("Organisation Name:", organisationName);

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


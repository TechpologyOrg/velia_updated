import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axiosClient';

const REFRESH_STORAGE_KEY = 'velia_refresh_token';

export default function CustomerAuthenticationController() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const auth = useAuth();
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const run = async() => {
            try
            {
                const idToken = state?.idToken || sessionStorage.getItem('id_token');
                const searchParams = new URLSearchParams(window.location.search);
                const organisationId = searchParams.get('oid');
                console.log("Organisation ID:", organisationId);
                await api.post(
                    '/auth/bankid/login/organisation/',
                    { id_token: idToken, organisation_id: organisationId },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                .then(async (response) => {
                    console.log("Authentication response:", response);

                    sessionStorage.setItem('user', JSON.stringify(response.data));
                    sessionStorage.removeItem('id_token');
                    sessionStorage.removeItem('claims');

                    const { access, refresh, user } = response.data || {};
                    if (!access || !refresh) throw new Error('Invalid login response (missing tokens)');

                    sessionStorage.setItem(REFRESH_STORAGE_KEY, refresh);
                    if (typeof auth?.login === 'function') {
                        // Preferred: your AuthContext handles access token scheduling/refresh
                        await auth.login({ access, refresh, user });
                    } else if (typeof auth?.setUser === 'function') {
                        // Fallback: minimal UI state only (not a trust source)
                        auth.setUser({
                            // use server user as source of truth where possible
                            name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || user?.email,
                            ssn: user?.personnummer,
                            idToken,       // from Criipto (optional to keep)
                            accessToken: access // keep temporarily if you don’t have AuthContext.login yet
                        });
                    }
                    
                    console.log("User authenticated successfully:", response.data);
                    const organisationName = searchParams.get('organisation');
                    navigate(`/${organisationName}/customer/dashboard/home`, { replace: true });
                })
                .catch(error => {
                    console.error("Authentication error:", error);
                    setError("Authentication failed. Please try again.");
                    const organisationName = searchParams.get('organisation');
                    navigate(`/${organisationName}/customer/login`, { replace: true });
                });
            }
            catch(e)
            {
                console.error("Error during authentication:", e);
                setError("An unexpected error occurred. Please try again.");
                const organisationName = searchParams.get('organisation');
                navigate(`/${organisationName}/customer/login`, { replace: true });
            }
        }
        run();
    }, []);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <p className="text-[32px] bg-blue-400">Authenticating...</p>
        </div>
    )
}

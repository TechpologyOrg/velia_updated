import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCriiptoVerify } from '@criipto/verify-react';
import { useAuth } from '../../context/AuthContext';

export default function Callback() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { result, claims, error, isLoading } = useCriiptoVerify();
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const go = async () => 
        {
            if(!result?.id_token || posting) return;
            setPosting(true);
            try{
                const returnTo = sessionStorage.getItem('returnTo') || '/';
                sessionStorage.removeItem('returnTo');

                sessionStorage.setItem('id_token', result.id_token);
                sessionStorage.setItem('claims', JSON.stringify(claims || {}));

                navigate(returnTo, { 
                    replace: true,
                    state: { 
                        id_token: result.id_token,
                        claims
                    }
                });
            }
            catch(e)
            {
                console.error("Error processing ID token:", e);
                navigate('/Login', { replace: true });
            }
        }
        if(!isLoading && !error) go();
    }, [result, claims, error, isLoading, posting, navigate, setUser]);

    return (
        <div className="flex flex-col items-center justify-center text-blue-400 h-screen w-full">
            <p className="text-[42px]">Redirecting...</p>
        </div>
    )
}

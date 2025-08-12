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
                console.log(result.id_token);
                console.log(claims);

                const returnTo = sessionStorage.getItem('returnTo') || '/';
                sessionStorage.removeItem('returnTo');
                navigate(returnTo, { replace: true });
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

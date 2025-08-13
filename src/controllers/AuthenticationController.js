import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuthenticationController() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { setUser } = useAuth();
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const run = async() => {
            try
            {
                const idToken = state?.idToken || sessionStorage.getItem('id_token');
                axios.post('/api/v1/auth/bankid/login/', { id_token: idToken })
                .then(response => {
                    console.log("Authentication response:", response);
                    setUser({
                        name: response.data.name,
                        ssn: response.data.ssn,
                        idToken
                    });
                    sessionStorage.setItem('user', JSON.stringify(user));
                    sessionStorage.removeItem('id_token');
                    sessionStorage.removeItem('claims');
                    
                    console.log("User authenticated successfully:", user);
                    navigate('/dashboard', { replace: true });
                })
                .catch(error => {
                    console.error("Authentication error:", error);
                    setError("Authentication failed. Please try again.");
                    navigate('/Login', { replace: true });
                });
            }
            catch(e)
            {
                console.error("Error during authentication:", e);
                setError("An unexpected error occurred. Please try again.");
                navigate('/Login', { replace: true });
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

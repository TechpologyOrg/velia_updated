import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCriiptoVerify } from '@criipto/verify-react'
import { useAuth } from '../context/AuthContext'

import V_Input from '../components/V_Input'

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const { loginWithRedirect, result, claims, isLoading, error } = useCriiptoVerify();

    const [submitting, setSubmitting] = useState(false);

    const startBankIdLogin = async (thisDevice = false) => {
        sessionStorage.setItem('returnTo', '/controllers/authenticate');

        await loginWithRedirect({
            acr_values: thisDevice ? "urn:grn:authn:se:bankid:same-device" : "urn:grn:authn:se:bankid:another-device:qr"
        })
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

import React from 'react'
import { useNavigate } from 'react-router-dom';

import VeliaIcon from '../svg/VeliaIcon'
import Velia from '../svg/Velia'

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row h-[100px] w-full justify-between items-center px-[140px] bg-white">
                <Velia size={124} />

                <div className="flex flex-row gap-8">
                    <p onClick={()=>{navigate('/login')}}>Login</p>
                    <p onClick={()=>{navigate('/Signup')}}>Signup</p>
                </div>
            </div>
        </div>
    )
}

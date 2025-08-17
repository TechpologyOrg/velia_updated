import React, { useState, useEffect } from 'react'

export default function CustomerDashboardHome() {
    const user = JSON.parse(sessionStorage.getItem('user')).user;
    const organisation = user.organisation;

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
    }, []);

    return (
        <div className="flex flex-col w-full h-full p-8">
            <p className="text-2xl md:text-3xl font-semibold mb-2">Ärenden</p>
            <p className="text-neutral-500">Visa och hantera dina ärenden i ett tydligt listformat.</p>
        </div>
    )
}
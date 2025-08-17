import React from 'react'

export default function CustomerDashboard() {

    // Get the organisation Object from the sessionStorage user object
    const organisation = JSON.parse(sessionStorage.getItem('user')).user.organisation;

    return (
        <div className='w-full h-screen flex flex-col'>
            <div className='w-full h-[100px] bg-white flex items-center justify-between'>
                <img src={organisation.logo_url} alt={organisation.name} className='w-[100px] h-[100px]' />
            </div>
        </div>
    )
}

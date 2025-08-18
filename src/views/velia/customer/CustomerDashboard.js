import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { V_SidebarBtn } from '../Dashboard';
import { RiHomeLine } from 'react-icons/ri';
import { LuPanelLeft } from 'react-icons/lu';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [panelOpen, setPanelOpen] = useState(true);

  // Get the organisation Object from the sessionStorage user object
  const user = JSON.parse(sessionStorage.getItem('user')).user;
  const organisation = user.organisation;

  return (
    <div className='w-full h-screen flex flex-col md:px-[20%] px-4'>
      <div className='flex flex-row items-center justify-between py-8'>
        <img src={organisation.logo_url} alt={organisation.name} className='h-[40px]' />
      </div>

      <div className='w-full h-full overflow-y-scroll'>
        <Outlet />
      </div>
    </div>
  )
}

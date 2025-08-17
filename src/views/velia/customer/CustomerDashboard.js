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
        <div className='w-full h-screen flex flex-row'>
            {
              (panelOpen) ?
                <div className="flex flex-col w-[240px] h-full p-4 bg-neutral-100 shadow-inner border-r-[1px] border-neutral-200">
                  <div className="flex flex-row w-full gap-2 mb-8 items-center">
                    <img src={organisation.logo_url} alt={organisation.name} className='h-[40px]' />
                  </div>

                  <p className="text-[13px] text-neutral-500 font-medium">Navigation</p>
                  <div className="flex flex-col w-full pt-2">
                    <V_SidebarBtn title="Hem" icon={<RiHomeLine size={16} />} trigger={()=>{navigate("/customer/dashboard/home")}} />
                  </div>
                </div> : <></>
            }

            <div className="flex flex-col px-4 flex-1 h-screen overflow-y-scroll">
              <div className="flex px-3 w-full items-center h-[48px] border-b-[1px] border-[#00000010]">
                <div className="hover:bg-neutral-200 p-1 rounded-md cursor-pointer" onClick={()=>{setPanelOpen(!panelOpen)}}>
                  <LuPanelLeft size={16} />
                </div>
              </div>

              <div className="p-8">
                <Outlet />
              </div>
            </div>
        </div>
    )
}

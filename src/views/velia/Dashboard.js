import React from 'react'
import { Outlet } from 'react-router-dom';

import { RiGroupLine } from "react-icons/ri";
import { LuPanelLeft } from "react-icons/lu";

function V_SidebarBtn(props)
{
  return (
    <div className="w-full py-2 px-2 rounded-md flex flex-row gap-4 items-center hover:bg-[#00000008] cursor-pointer">
      {props.icon ?? <></>}
      <p className="text-sm font-medium">{props.title}</p>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-col w-[240px] h-full p-4 bg-neutral-100 shadow-inner border-r-[1px] border-neutral-200">
        <div className="flex flex-row w-full gap-2 mb-8">
          <div className="w-[24px] h-[24px] bg-neutral-200 shadow-inner rounded-sm"/>
          <p className="font-medium">Portal</p>
        </div>

        <p className="text-[13px] text-neutral-500 font-medium">Navigation</p>
        <div className="flex flex-col w-full pt-2">
          <V_SidebarBtn title="Grupper" icon={<RiGroupLine size={16} />} />
        </div>
      </div>

      <div className="flex flex-col px-4 flex-1 h-screen overflow-y-scroll">
        <div className="flex px-3 w-full items-center h-[48px] border-b-[1px] border-[#00000010]">
          <LuPanelLeft size={16} />
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>

    </div>
  )
}

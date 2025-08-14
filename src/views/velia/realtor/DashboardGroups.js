import React, {useState, useEffect} from 'react'
import api from "../../../lib/axiosClient"
import { useAuth } from '../../../context/AuthContext'

export default function DashboardGroups() {
  const [groups, setGroups] = useState([])
  const { loading, isAuthenticated } = useAuth()

  useEffect(()=>{
    if (loading) return;
    if (!isAuthenticated) return;
    api.get("/groups/mine/")
    .then(resp => {
      console.log(resp.data);
      setGroups(resp.data ?? [])
    })
    .catch(err=>{
      console.error(err?.response?.data || err.message)
    })
  }, [loading, isAuthenticated])

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-2xl md:text-3xl font-semibold mb-2">Grupper</p>
      <p className="text-neutral-500">Visa och hantera grupper i ett tydligt listformat.</p>

      <div className="flex flex-row gap-4 mt-8">
        <btn className="bg-black text-white px-4 py-2 text-center flex items-center justify-center text-[14px] font-medium rounded-lg">Skapa grupp</btn>
        <btn className="bg-white text-black shadow-inner border-[1px] border-neutral-200 px-4 py-2 text-center flex items-center justify-center text-[14px] font-medium rounded-lg">Importera</btn>
      </div>
    </div>
  )
}

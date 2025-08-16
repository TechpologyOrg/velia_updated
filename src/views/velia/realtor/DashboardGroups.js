import React, {useState, useEffect} from 'react'
import api from "../../../lib/axiosClient"
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

import { FaPlus, FaEdit, FaCheck, FaTrash } from 'react-icons/fa';

export default function DashboardGroups() {
  const [groups, setGroups] = useState([]);
  const [groupsNext, setGroupsNext] = useState("");
  const [groupsPrev, setGroupsPrev] = useState("");
  const [groupsCount, setGroupsCount] = useState(0);
  const { loading, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(()=>{
    console.log('DashboardGroups: useEffect triggered, loading:', loading, 'isAuthenticated:', isAuthenticated);
    if (loading) {
      console.log('DashboardGroups: Still loading, skipping API call');
      return;
    }
    if (!isAuthenticated) {
      console.log('DashboardGroups: Not authenticated, skipping API call');
      return;
    }
    console.log('DashboardGroups: Making API call to /groups/mine/');
    api.get("/groups/mine/")
    .then(resp => {
      console.log('DashboardGroups: API call successful:', resp.data);
      setGroups(resp.data.results ?? [])
      setGroupsCount(resp.data.count)
      setGroupsNext(resp.data.next)
      setGroupsPrev(resp.data.previous)
    })
    .catch(err=>{
      console.error('DashboardGroups: API call failed:', err?.response?.data || err.message)
    })
  }, [loading, isAuthenticated])

  const deleteGroup = (id) => {
    api.delete(`/groups/${id}/delete/`)
    .then(resp => {
      console.log('DashboardGroups: Group deleted successfully:', resp.data);
    })
    .catch(err=>{
      console.error('DashboardGroups: API call failed:', err?.response?.data || err.message)
    })
  }

  const renderGroups = () =>
  {
    if(groups.length == 0)
    {
      return (
        <tr className="h-[52px] w-full">
          <td>No groups found</td>
        </tr>
      )
    }

    var toRet = [];
    groups.map((group, index) => {
      toRet.push(
        <tr
          className='h-[42px] cursor-pointer hover:bg-neutral-200 text-start'
          onClick={() => { navigate(`/dashboard/groups/update/${group.id}`) }}
        >
          <td>{group.realtor.first_name} {group.realtor.last_name}</td>
          <td>{group.customers.length}</td>
          <td>{group.coordinator.first_name} {group.coordinator.last_name}</td>
          <td>{group.address}</td>
          <td>{group.postnummer}</td>
          <td>{group.ort}</td>
          <td
            className='cursor-pointer text-red-500'
            onClick={e => {
              e.stopPropagation();
              deleteGroup(group.id);
            }}
          >
            <FaTrash />
          </td>
        </tr>
      )
    })

    return toRet;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-2xl md:text-3xl font-semibold mb-2">Grupper</p>
      <p className="text-neutral-500">Visa och hantera grupper i ett tydligt listformat.</p>

      <div className="flex flex-row gap-4 mt-8">
        <btn onClick={()=>{navigate("/dashboard/groups/create")}} className="bg-black text-white px-4 py-2 text-center flex items-center justify-center text-[14px] font-medium rounded-lg">Skapa grupp</btn>
        {/*<btn className="bg-white text-black shadow-inner border-[1px] border-neutral-200 px-4 py-2 text-center flex items-center justify-center text-[14px] font-medium rounded-lg">Importera</btn>*/}
      </div>

      <div className="w-full mt-6 overflow-x-auto rounded-xl bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className='border-b-[1px] border-neutral-200'>
            <tr>
              <th className="pl-1 py-3">Mäklare</th>
              <th className="pl-1 py-3">Säljare</th>
              <th className="pl-1 py-3">Koordinator</th>
              <th className="pl-1 py-3">Adress</th>
              <th className="pl-1 py-3">Postnmr</th>
              <th className="pl-1 py-3">Ort</th>
              <th className="pl-1 py-3">-</th>
            </tr>
          </thead>
          <tbody>
            {renderGroups()}
          </tbody>
        </table>

      </div>
    </div>
  )
}

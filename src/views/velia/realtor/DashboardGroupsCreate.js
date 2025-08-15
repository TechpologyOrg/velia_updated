import React, { useState, useEffect } from 'react'
import api from "../../../lib/axiosClient"
import { useAuth } from '../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import V_SelectObject from '../../../components/V_SelectObject'

import { FaPlus, FaEdit, FaCheck, FaTrash } from 'react-icons/fa';

function AddCustomerWindow() {
    const [users, setUsers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    // Helper to handle field changes
    const handleFieldChange = (idx, field, value) => {
        setUsers(prev =>
            prev.map((user, i) =>
                i === idx ? { ...user, [field]: value } : user
            )
        );
    };

    // Add a new user in edit mode
    const handleAddUser = () => {
        setUsers(prev => [
            ...prev,
            { fullName: '', personnummer: '', email: '', isNew: true }
        ]);
        setEditingIndex(users.length);
    };

    // Save edits (for both new and existing)
    const handleSave = (idx) => {
        setUsers(prev =>
            prev.map((user, i) =>
                i === idx ? { ...user, isNew: false } : user
            )
        );
        setEditingIndex(null);
    };

    // Start editing an existing user
    const handleEdit = (idx) => {
        setEditingIndex(idx);
    };

    // Remove a user
    const handleRemove = (idx) => {
        setUsers(prev => prev.filter((_, i) => i !== idx));
        // If the removed user was being edited, reset editingIndex
        if (editingIndex === idx) {
            setEditingIndex(null);
        } else if (editingIndex > idx) {
            // Adjust editingIndex if after the removed one
            setEditingIndex(editingIndex - 1);
        }
    };

    return (
        <div className='w-full p-2 rounded-md bg-neutral-100 flex flex-row overflow-x-scroll relative min-h-[180px]'>
            {users.map((user, idx) => (
                <div
                    key={idx}
                    className="relative flex flex-col bg-white rounded-lg shadow-md p-4 m-2 min-w-[260px] max-w-[280px] border border-neutral-200"
                >
                    {/* Edit/Save and Remove button top right */}
                    <div className="absolute top-2 right-2 flex flex-row gap-2">
                        {editingIndex === idx ? (
                            <button
                                onClick={() => handleSave(idx)}
                                className="text-green-500 hover:text-green-600"
                                title="Spara"
                            >
                                <FaCheck />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleEdit(idx)}
                                    className="text-blue-500 hover:text-blue-600"
                                    title="Redigera"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleRemove(idx)}
                                    className="text-red-500 hover:text-red-400"
                                    title="Ta bort"
                                >
                                    <FaTrash />
                                </button>
                            </>
                        )}
                    </div>
                    {/* Card content */}
                    {editingIndex === idx ? (
                        <div className="flex flex-col gap-2 mt-2">
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="Fullständigt namn"
                                value={user.fullName}
                                onChange={e => handleFieldChange(idx, 'fullName', e.target.value)}
                            />
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="Personnummer"
                                value={user.personnummer}
                                onChange={e => handleFieldChange(idx, 'personnummer', e.target.value)}
                            />
                            <input
                                className="border rounded px-2 py-1"
                                placeholder="E-post"
                                value={user.email}
                                onChange={e => handleFieldChange(idx, 'email', e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 mt-2">
                            <div className="font-semibold text-[16px]">{user.fullName || <span className="text-neutral-400">Namn saknas</span>}</div>
                            <div className="text-[14px] text-neutral-600">{user.personnummer || <span className="text-neutral-400">Personnummer saknas</span>}</div>
                            <div className="text-[14px] text-neutral-600">{user.email || <span className="text-neutral-400">E-post saknas</span>}</div>
                        </div>
                    )}
                </div>
            ))}
            {/* Add button, bottom right, floating over cards */}
            <button
                onClick={handleAddUser}
                className="absolute bottom-2 right-4 bg-blue-400 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg flex items-center justify-center transition"
                title="Lägg till kund"
                style={{ zIndex: 10 }}
            >
                <FaPlus size={14} />
            </button>
        </div>
    );
}

export default function DashboardGroupsCreate() {
    const navigate = useNavigate();

    const [coordinators, setCoordinators] = useState([]);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);

    useEffect(()=>{
        api.get("/users/staff/?role=coordinator")
        .then(resp=>{
            setCoordinators(resp.data.results)
        })
        .catch(err=>{
            console.error(err.message)
        })
    },[])

    const handleCoordinatorSelect = (coordinator) => {
        console.log(coordinator)
        setSelectedCoordinator(coordinator)
    }

    return (
        <div className="flex flex-col w-full h-full">
            <p className="text-2xl md:text-3xl font-semibold mb-2">Skapa Grupp</p>
            <p className="text-neutral-500">Skapa ett nytt grupp för fastigheten</p>

            <div className="flex flex-col w-full gap-4 mt-8">
                {/* Add group info */}
                <input placeholder='Adress' className='text-[42px] px-4 border-b-[1px] border-neutral-300 font-medium max-w-[620px]' />
                <div className='flex flex-row gap-2 w-full text-[18px]'>
                    <input placeholder='Postnummer' className='px-4 border-b-[1px] border-neutral-300 max-w-[220px]' />
                    <p>,</p>
                    <input placeholder='Ort' className='px-4 border-b-[1px] border-neutral-300 max-w-[220px]' />
                </div>

                {/* Add realtor and coordinator */}
                <V_SelectObject cardTitle='Välj koordinator' items={coordinators} displayKey='first_name' displayKey2='last_name' valueKey='id' onSelect={handleCoordinatorSelect} />

                {/* Add customer */}
                <p>Lägg till säljare</p>
                <AddCustomerWindow />
            </div>

        </div>
    )
}

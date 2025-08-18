import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa';
import V_Popup from '../../../components/V_Popup';
import api from '../../../lib/axiosClient';

export default function DashboardGroupView() {
    const { group } = useLocation().state;
/*     const group = {
		"id": 9,
		"organisation": 1,
		"address": "Stockholmsvägen 11",
		"postnummer": "60216",
		"ort": "Nrkpg",
		"realtor": {
			"id": 3,
			"email": "eli@asd.se",
			"first_name": "Ali",
			"last_name": "Al Rashini",
			"role": "realtor",
			"personnummer": "200404228959"
		},
		"coordinator": {
			"id": 4,
			"email": "daniel@asd.se",
			"first_name": "Daniel",
			"last_name": "Stjernkvist",
			"role": "coordinator",
			"personnummer": "200302157870"
		},
		"customers": [
			{
				"id": 10,
				"email": "kevin@sundberg.com",
				"first_name": "Kevin",
				"last_name": "Sundvergs",
				"role": "customer",
				"personnummer": "197905317793"
			}
		]
	} */

    const renderCustomers = () => {
        return group.customers.map((customer) => {
            return <div className='flex flex-col px-4 py-2 bg-white shadow-md rounded-md items-start justify-center'
             key={customer.id}>
                <p className='text-md text-neutral-500 font-semibold mb-2'>{customer.first_name} {customer.last_name}</p>
                <p className='text-sm text-neutral-500'>{customer.email}</p>
                <p className='text-sm text-neutral-500'>{customer.personnummer}</p>
             </div>
        })
    }

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [taskTemplates, setTaskTemplates] = useState([]);
    const getTaskTemplates = () => {
        api.get(`/task-templates/`)
        .then(resp => {
            console.log(resp.data);
            setTaskTemplates(resp.data.results);
        })
        .catch(err => {
            console.error(err);
        })
    }

    useEffect(() => {
        getTaskTemplates();
    }, []);

    const assignTask = (template) => {
        api.post(`/tasks/`, {
            template_id: template.id,
            group_id: group.id,
            is_shared: sharedTask,
            due_date: dueDate,
            title: template.title,
            description: template.description,
            status: "pending",
            questions: template.questions
        })
        .then(resp => {
            console.log(resp.data);
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            setIsPopupOpen(false);
        })
    }

    const [expandedTemplateId, setExpandedTemplateId] = useState(null);
    const [sharedTask, setSharedTask] = useState(false);
    const [dueDate, setDueDate] = useState('');

    const renderPopup = () => {
        if (taskTemplates.length === 0) {
            return (
                <V_Popup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="Lägg till ärende"
                >
                    <p className='text-sm text-neutral-500 self-center mt-4'>Inga mer ärenden att lägga till</p>
                </V_Popup>
            )
        }
        else {
            return (
                <V_Popup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    title="Lägg till ärende"
                >

                    <div className='flex flex-col overflow-y-scroll w-full h-full'>
                        {taskTemplates.map((template) => {
                            return (
                                <React.Fragment key={template.id}>
                                    <div
                                        className='flex flex-row items-center justify-between py-3 px-2 hover:bg-neutral-200 rounded-md cursor-pointer'
                                        onClick={() => {
                                            setExpandedTemplateId(expandedTemplateId === template.id ? null : template.id);
                                            setSharedTask(false);
                                            setDueDate('');
                                        }}
                                    >
                                        <div className='flex flex-col'>
                                            <p className='text-md text-neutral-500 font-semibold'>{template.title}</p>
                                            <p className='text-sm text-neutral-500'>{template.description}</p>
                                        </div>
                                        <FaPlus size={16} className="mr-1" />
                                    </div>
                                    {expandedTemplateId === template.id && (
                                        <div className="animate-slide-down flex flex-col gap-4 bg-neutral-100 rounded-md px-4 py-4 mt-2 mb-2 border border-neutral-200">
                                            <div className="flex flex-row items-center gap-4">
                                                <label className="flex items-center gap-2 text-sm text-neutral-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={sharedTask}
                                                        onChange={e => setSharedTask(e.target.checked)}
                                                    />
                                                    Dela ärende (shared task)
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-neutral-700">
                                                    Deadline:
                                                    <input
                                                        type="datetime-local"
                                                        value={dueDate}
                                                        onChange={e => setDueDate(e.target.value)}
                                                        className="border border-neutral-300 rounded px-2 py-1"
                                                    />
                                                </label>
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <button
                                                    className="px-4 py-2 bg-black text-white rounded-md"
                                                    onClick={() => {
                                                        // Convert dueDate to correct ISO 8601 format (YYYY-MM-DDTHH:mm)
                                                        let dueDateISO = dueDate
                                                            ? new Date(dueDate).toISOString().slice(0, 16)
                                                            : undefined;
                                                        assignTask({
                                                            ...template,
                                                            shared: sharedTask,
                                                            due_date: dueDateISO
                                                        });
                                                        setExpandedTemplateId(null);
                                                    }}
                                                >
                                                    Lägg till
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-neutral-300 text-black rounded-md"
                                                    onClick={() => setExpandedTemplateId(null)}
                                                >
                                                    Avbryt
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </V_Popup>
            )
        }
    }

    return (
        <div className="flex flex-col w-full h-full">
            {renderPopup()}
            <div className='flex flex-row items-end gap-2'>
                <p className="text-4xl font-semibold">{group.address}</p>
                <p className='text-neutral-800 text-xl'>{group.postnummer}, {group.ort}</p>
            </div>
            <p className="text-neutral-500 text-lg">Visa och hantera grupp</p>

            <div className='flex flex-row w-full flex-wrap md:flex-nowrap items-center justify-between mt-8'>
                <div className='flex flex-col w-full md:w-[200px] py-4'>
                    <p className='text-sm text-neutral-500 font-semibold'>Mäklare</p>
                    <p className='text-sm text-neutral-500 mb-8'>{group.realtor.first_name} {group.realtor.last_name}</p>

                    <p className='text-sm text-neutral-500 font-semibold'>Koordinator</p>
                    <p className='text-sm text-neutral-500'>{group.coordinator.first_name} {group.coordinator.last_name}</p>
                </div>

                <div className='flex flex-row flex-1 h-full gap-4 p-4 overflow-x-scroll bg-neutral-100 rounded-md'>
                    {renderCustomers()}
                </div>
            </div>

            <div className="flex flex-col w-full mt-8 gap-4">
            </div>

            <button className='px-4 py-2 bg-black cursor-pointer text-white rounded-md w-[180px] self-center flex items-center justify-center gap-2' onClick={() => setIsPopupOpen(true)}>
                <FaPlus size={16} className="mr-1" />
                Lägg till ärende
            </button>
        </div>
    )
}

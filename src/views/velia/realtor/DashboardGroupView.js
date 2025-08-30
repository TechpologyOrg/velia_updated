import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../../lib/axiosClient';
import { CardTemplateRenderer } from '../../../controllers/CardTemplateController';
import V_Popup from '../../../components/V_Popup';

import { FaPlus } from 'react-icons/fa';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function TaskCard({ task, children, cardJson, setCardJson, globalVars }) {
    const [open, setOpen] = useState(false);

    // Simple status color mapping
    const statusColors = {
        'pending': 'bg-yellow-200 text-yellow-800',
        'in_progress': 'bg-blue-200 text-blue-800',
        'completed': 'bg-green-200 text-green-800',
        'overdue': 'bg-red-200 text-red-800',
    };
    const statusLabel = {
        'pending': 'Ej påbörjad',
        'in_progress': 'Pågår',
        'completed': 'Klar',
        'overdue': 'Försenad',
    };

    const pillClass = statusColors[task.status] || 'bg-neutral-200 text-neutral-700';

    return (
        <div className="w-full">
            <div
                className="flex items-center w-full px-4 py-3 bg-white rounded-lg shadow cursor-pointer transition hover:bg-neutral-50"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate">{task.title}</div>
                    <div className="text-sm text-neutral-500 mt-1">
                        {/* Example info: deadline and assigned to */}
                        {task.deadline && (
                            <span className="mr-4">
                                Deadline: {new Date(task.deadline).toLocaleString('sv-SE')}
                            </span>
                        )}
                        {task.assigned_to && (
                            <span>
                                Ansvarig: {task.assigned_to.first_name} {task.assigned_to.last_name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pillClass}`}>
                        {statusLabel[task.status] || task.status}
                    </span>
                    <p
                        className={`text-sm ${
                            task.due_date && new Date(task.due_date) < new Date()
                                ? 'text-red-500'
                                : 'text-neutral-500'
                        }`}
                    >
                        Förfallodatum: {task.due_date}
                    </p>
                </div>
                <div className="ml-4 flex items-center">
                    {open ? <FaChevronDown /> : <FaChevronRight />}
                </div>
            </div>
            {open && (
                <div className="w-full bg-neutral-50 border-l-4 border-black rounded-b-lg px-6 py-4 mt-1">
                    {/* Place for extra info or actions */}
                    {children ? children : (
                        <div className="text-neutral-600 text-sm flex flex-col gap-2">
                            <div className='flex flex-row w-full items-center justify-between'>
                                <CardTemplateRenderer jsonTemplate={cardJson} globalVars={globalVars} onChange={setCardJson} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

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
        getTasks();
    }, []);

    const assignTask = (template) => {
        // Convert dueDate to ISO format if it exists
        const dueDateISO = dueDate ? new Date(dueDate).toISOString() : undefined;
        
        api.post(`/tasks/`, {
            template_id: template.id,
            group_id: group.id,
            is_shared: sharedTask,
            due_date: dueDateISO,
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
            getTasks();
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
                                                        assignTask(template);
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

    const [tasks, setTasks] = useState([]);
    const getTasks = () => {
        api.get(`/tasks/group/${group.id}/`)
        .then(resp => {
            console.log(resp.data);
            setTasks(resp.data.results);
        })
        .catch(err => {
            console.error(err);
        })
    }
    const renderTasks = () => {
        return tasks.map((task) => {
            return (
                <TaskCard
                    key={task.id}
                    task={task}
                    cardJson={task.realtor_card}
                    setCardJson={updatedCardJson => {
                        setTasks(prevTasks =>
                            prevTasks.map(t =>
                                t.id === task.id
                                    ? { ...t, realtor_card: updatedCardJson }
                                    : t
                            )
                        );
                    }}
                    // Make a copy of globalVars and add more keys if needed
                    globalVars={{
                        ...globalVars,
                        "Namn": `${task.customer.first_name} ${task.customer.last_name}`,
                        "Personnummer": task.customer.personnummer,
                        "Födelsedag": task.customer.personnummer.slice(0, 4) + "-" + task.customer.personnummer.slice(4, 6) + "-" + task.customer.personnummer.slice(6, 8),
                        "Email": task.customer.email,
                        "Ägarandel": task.customer.ägarandel,
                        // If the task has a property "extraVars", spread its keys into globalVars
                        ...(task.title.includes("KYC") ? {
                            // "Screening": task.title.includes("Screening") ? "Ja" : "Nej",
                            // "ScreeningResults": task.title.includes("Screening") ? "Ja" : "Nej",
                            // "ID-Kontroll": task.title.includes("ID-Kontroll") ? "Ja" : "Nej",
                            "formURL": `https://www.velia.se/${task.organisation.name}/customer/dashboard/task/${task.id}`
                        } : {}),
                    }}
                />
            );
        })
    };

    const [globalVars, setGlobalVars] = useState({
        "group": group,
        "customers": group.customers,
        "realtor": group.realtor,
        "coordinator": group.coordinator,
    });

    const [cardJson, setCardJson] = useState([
        {
            "tag": "div", "class": "flex flex-row justify-between items-center w-full h-full p-2", "children": [
                {
                    "tag": "div", "class": "flex flex-col gap-2", "children": [
                        { "tag": "Itext", "type": "Editable", "title": "Namn", "value": "", "var": "namn" },
                        { "tag": "Itext", "type": "Editable", "title": "Personnummer", "value": "", "var": "personnummer" },
                        { "tag": "Itext", "type": "Editable", "title": "Födelsedag", "value": "", "var": "födelsedag" },
                        { "tag": "Itext", "type": "Editable", "title": "Adress", "value": "", "var": "adress" },
                        { "tag": "Itext", "type": "Editable", "title": "Email", "value": "", "var": "email" },
                        { "tag": "Itext", "type": "Editable", "title": "Telefon", "value": "", "var": "telefon" },
                        { "tag": "Itext", "type": "Editable", "title": "Ägarandel", "value": "", "var": "ägarandel" },

                        {
                            "tag": "div", "class": "flex flex-col gap-2", "children": [
                                { "tag": "IBool", "type": "display", "title": "ID-Kontroll", "value": "", "var": "id_kontroll" },
                                { "tag": "IBool", "type": "display", "title": "Formulär", "value": "", "var": "formulär" }
                            ]
                        },
                        { "tag": "p", "type": "display", "value": "Screening" },
                        { "tag": "p", "type": "display", "var": "ScreeningResults", "value": "" }
                    ]
                }
            ]
        }
    ]);

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

            <button className='px-4 py-2 bg-black cursor-pointer text-white rounded-md w-[180px] self-center flex items-center justify-center gap-2' onClick={() => setIsPopupOpen(true)}>
                <FaPlus size={16} className="mr-1" />
                Lägg till ärende
            </button>

            <div className="flex flex-col w-full mt-8 gap-4">
                {renderTasks()}
            </div>
        </div>
    )
}

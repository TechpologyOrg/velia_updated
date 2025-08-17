import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/axiosClient';

export default function CustomerDashboardHome() {
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user')).user;
    const organisation = user.organisation;

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        api.get(`/task-responses/`)
        .then((res) => {
            console.log(res.data.results);
            setTasks(res.data.results);
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);

    const renderTasks = () => {
        return tasks.map((task) => {
            return (
                <div className="flex flex-row w-full max-w-3xl h-[160px] bg-white rounded-xl shadow-md overflow-hidden my-4" onClick={() => {navigate(`/customer/dashboard/task/${task.id}`)}}>
                    {/* Info section */}
                    <div className="flex flex-col flex-1 p-6 justify-center">
                        <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                        <div className="text-sm text-neutral-600 mb-1">
                            <span className="font-medium">Tilldelad:</span>{" "}
                            {task.assigned_at ? new Date(task.assigned_at).toLocaleDateString() : "Saknas"}
                        </div>
                        <div className="text-sm text-neutral-600">
                            <span className="font-medium">Förfallodatum:</span>{" "}
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "Saknas"}
                        </div>
                    </div>
                    {/* Image section */}
                    <div className="w-[180px] h-full flex-shrink-0">
                        <img
                            src={task.task.realtor.profile_picture_url}
                            alt={task.realtor.first_name + " " + task.realtor.last_name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="flex flex-col w-full h-full p-8">
            <p className="text-2xl md:text-3xl font-semibold mb-2">Ärenden {tasks.length}</p>
            <p className="text-neutral-500">Visa och hantera dina ärenden i ett tydligt listformat.</p>

            <div className="w-full h-full flex flex-col mt-8">
                {renderTasks()}
            </div>
        </div>
    )
}
import React, { useState, useEffect, useRef } from 'react'
import { GenerateTemplate } from '../../controllers/TemplateController';
import { useParams } from 'react-router-dom';
import api from '../../lib/axiosClient';

export default function ViewForm() {
    const { id } = useParams();

    const [template, setTemplate] = useState([]);

    useEffect(() => {
        api.get(`/task-responses/${id}/`)
            .then((res) => {
                if (res.data && res.data.answers) {
                    // add a key to the template named "vars" with the value being an object
                    setTemplate({answers: res.data.answers, vars: {
                        "customer_full_name": res.data.customer.first_name + " " + res.data.customer.last_name,
                        "customer_personnummer": res.data.customer.personnummer,
                        "customer_email": res.data.customer.email,
                    }});
                } else {
                    console.error("No template found in response:", res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch template:", err);
            });
    }, []);

    return (
        <div className='flex flex-col w-full h-full items-center justify-center overflow-y-scroll'>
            <GenerateTemplate
                template={template}
                SetTemplate={(newTemplate) => {
                    // Always update state to a new array to trigger re-render
                    setTemplate([...newTemplate]);
                }}
            />
            <button
                className='px-4 py-2 bg-black cursor-pointer text-white rounded-md w-[180px] self-center flex items-center justify-center gap-2'
                onClick={() => {
                    console.log("Current template state:", template);
                }}
            >
                Klar
            </button>
        </div>
    )
}
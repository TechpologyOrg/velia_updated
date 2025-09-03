import React, { useState, useEffect, useRef } from 'react'
import { GenerateTemplate } from '../../controllers/TemplateController';
import { useParams } from 'react-router-dom';
import api from '../../lib/axiosClient';

export default function ViewForm() {
    const { id } = useParams();

    const [template, setTemplate] = useState([]);
    const [status, setStatus] = useState("pending");
    const [saveStatus, setSaveStatus] = useState("saved"); // "saved", "unsaved", "saving"
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        api.get(`/task-responses/${id}/`)
            .then((res) => {
                console.log('API response:', res.data);
                if (res.data && res.data.answers) {
                    // Ensure answers is an array and has the correct structure
                    const answers = Array.isArray(res.data.answers) ? res.data.answers : [];
                    console.log('Processed answers:', answers);
                    
                    setTemplate({
                        answers: answers,
                        vars: {
                            "customer_full_name": JSON.parse(sessionStorage.getItem('user')).user.first_name + " " + JSON.parse(sessionStorage.getItem('user')).user.last_name,
                            "customer_personnummer": JSON.parse(sessionStorage.getItem('user')).user.personnummer,
                            "customer_email": JSON.parse(sessionStorage.getItem('user')).user.email
                        },
                        title: res.data.task.title,
                        description: res.data.task.description
                    });
                } else {
                    console.error("No template found in response:", res.data);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch template:", err);
            });
    }, []);

    const updateAnswers = () => 
    {
        setSaveStatus("saving");
        api.put(`/task-responses/${id}/`, {
            answers: template.answers,
            status: status
        })
        .then((res) => {
            console.log(res);
            setSaveStatus("saved");
            setHasUnsavedChanges(false);
        })
        .catch((err) => {
            console.error("Failed to update answers:", err);
            setSaveStatus("unsaved");
        });
    }

    // Auto-save timer that runs every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (template.answers && template.answers.length > 0 && hasUnsavedChanges) {
                updateAnswers();
            }
        }, 10000); // 10 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [template.answers, status, hasUnsavedChanges]); // Re-run when template.answers, status, or hasUnsavedChanges changes

    const handleFormChange = () => {
        setHasUnsavedChanges(true);
        setSaveStatus("unsaved");
    };

    const getSaveStatusColor = () => {
        switch (saveStatus) {
            case "saved":
                return "bg-green-500";
            case "unsaved":
                return "bg-yellow-500";
            case "saving":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const getSaveStatusText = () => {
        switch (saveStatus) {
            case "saved":
                return "Saved";
            case "unsaved":
                return "Unsaved changes";
            case "saving":
                return "Saving...";
            default:
                return "Unknown";
        }
    };

    const genPDF = () => {
        api.post(`/task-responses/${id}/generate-pdf/`)
        .then((res) => {
            console.log(res);
            window.open(res.data.download_url, '_blank');
        })
        .catch((err) => {
            console.error("Failed to generate PDF:", err);
        });
    }

    return (
        <div className='flex flex-col w-full h-full items-center justify-center p-4'>
            {/* Main Form Window */}
            <div className='relative w-full max-w-4xl'>
                {/* Save Status Pill */}
                <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg ${getSaveStatusColor()}`}>
                    {getSaveStatusText()}
                </div>
                
                {/* Form Container */}
                <div className='bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'>
                    {/* Header */}
                    <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                        <h1 className='text-2xl font-bold text-gray-900'>{template.title}</h1>
                        <p className='text-sm text-gray-600 mt-1'>{template.description}</p>
                    </div>
                    
                    {/* Scrollable Content Area */}
                    <div className='h-[700px] overflow-y-auto px-6 py-6'>
                        <GenerateTemplate
                            template={template}
                            SetTemplate={(newTemplate) => {
                                setTemplate(newTemplate);
                            }}
                            onFormChange={handleFormChange}
                        />
                    </div>
                </div>
            </div>
            
            {/* Button Container */}
            <div className='mt-6 flex justify-center gap-4'>
                <button
                    className='px-6 py-3 bg-black hover:bg-gray-800 transition-colors duration-200 cursor-pointer text-white rounded-lg font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105'
                    onClick={() => {
                        updateAnswers();
                    }}
                >
                    Spara
                </button>
                <button
                    className='px-6 py-3 bg-black hover:bg-gray-800 transition-colors duration-200 cursor-pointer text-white rounded-lg font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105'
                    onClick={() => {
                        setStatus("Completed");
                        updateAnswers();
                    }}
                >
                    Klar
                </button>
                <button
                    className='px-6 py-3 bg-black hover:bg-gray-800 transition-colors duration-200 cursor-pointer text-white rounded-lg font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105'
                    onClick={() => {
                        genPDF();
                    }}
                >
                    Generera PDF
                </button>
            </div>
        </div>
    )
}
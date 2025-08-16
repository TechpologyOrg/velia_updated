import React, { useState, useEffect, useRef } from 'react'
import { GenerateTemplate } from '../../controllers/TemplateController';

export default function ViewForm() {
    const [template, setTemplate] = useState(
        [
            {
                "id": 0,
                "title": "are you gay",
                "type": "form",
                "questions":
                    [
                        {
                            "id": 0, "title": "do you like men", "type": "choice", "choices": [
                                "yes", "very much", "a lot", "of course"
                            ], "value": ""
                        },
                        { "id": 1, "title": "how many men have u slept with", "type": "numeric", "value": 10 }
                    ]
            }
        ]
    );

    // --- REWRITE: Remove broken interval logic, use a debounced effect instead ---

    // This ref holds the last logged template string
    const lastLoggedTemplateRef = useRef(JSON.stringify(template));
    // This ref holds the timeout id for debounce
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        // If template changed, debounce log after 5 seconds of inactivity
        if (JSON.stringify(template) !== lastLoggedTemplateRef.current) {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            debounceTimeoutRef.current = setTimeout(() => {
                console.log('Template changed:', template);
                lastLoggedTemplateRef.current = JSON.stringify(template);
            }, 5000);
        }
        // Cleanup on unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [template]);

    return (
        <div className='flex flex-col w-full h-full items-start justify-center pb-12'>
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
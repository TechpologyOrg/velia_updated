import React, { useState } from 'react';
import { GenerateTemplate } from '../controllers/TemplateController';

/**
 * Test component to demonstrate the hint feature functionality
 */
export default function TestHintFeature() {
    const [template, setTemplate] = useState({
        answers: [
            {
                id: 0,
                title: "Test Form with Hints",
                type: "form",
                visibleWhen: true,
                questions: [
                    {
                        id: 1,
                        title: "Name",
                        type: "text",
                        value: "",
                        hint: "Enter your full name as it appears on official documents"
                    },
                    {
                        id: 2,
                        title: "Email Address",
                        type: "text",
                        value: "",
                        placeholder: "your.email@example.com",
                        hint: "We'll use this email to send you important updates and notifications"
                    },
                    {
                        id: 3,
                        title: "Age",
                        type: "numeric",
                        value: 0,
                        hint: "Your age helps us provide age-appropriate content and services"
                    },
                    {
                        id: 4,
                        title: "Country",
                        type: "choice",
                        value: "",
                        choices: ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia"],
                        hint: "Select your country of residence for localized content"
                    },
                    {
                        id: 5,
                        title: "Subscribe to Newsletter",
                        type: "boolean",
                        value: "false",
                        hint: "Check this box to receive our weekly newsletter with tips and updates"
                    },
                    {
                        id: 6,
                        title: "Birth Date",
                        type: "date",
                        value: "",
                        hint: "Your birth date is used for age verification and personalized experiences"
                    },
                    {
                        id: 7,
                        title: "Interests",
                        type: "toggleList",
                        value: "",
                        choices: ["Technology", "Sports", "Music", "Travel", "Cooking", "Reading"],
                        hint: "Select all topics that interest you to customize your experience"
                    },
                    {
                        id: 8,
                        title: "Additional Comments",
                        type: "text",
                        value: "",
                        hint: "Any additional information you'd like us to know"
                    }
                ]
            }
        ],
        vars: {}
    });

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Hint Feature Test</h1>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="font-semibold mb-2">Instructions:</h2>
                <p className="text-sm text-blue-800">
                    Look for the question mark icons (?) next to field labels. 
                    Hover over them or click them to see helpful tooltips that explain what each field is for.
                </p>
            </div>

            <GenerateTemplate
                template={template}
                SetTemplate={setTemplate}
                onFormChange={() => console.log('Form changed')}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Form Data:</h3>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(template, null, 2)}
                </pre>
            </div>
        </div>
    );
}

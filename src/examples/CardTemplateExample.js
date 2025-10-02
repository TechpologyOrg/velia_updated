import React, { useState } from 'react';
import { CardTemplateRenderer } from '../controllers/CardTemplateController';

/**
 * Example usage of the enhanced CardTemplateController with event system
 * 
 * This example demonstrates:
 * - Conditional visibility based on component values
 * - Event handlers for interactive components
 * - Dynamic styling based on conditions
 * - Variable resolution from globalVars
 */
export default function CardTemplateExample() {
    const [cardJson, setCardJson] = useState([
        {
            "tag": "div",
            "class": "flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md",
            "children": [
                {
                    "tag": "h3",
                    "value": "Customer Information Card",
                    "class": "text-lg font-semibold text-gray-800"
                },
                {
                    "tag": "div",
                    "class": "grid grid-cols-2 gap-4",
                    "children": [
                        {
                            "tag": "Itext",
                            "type": "Editable",
                            "title": "Customer Name",
                            "value": "",
                            "var": "customer_name",
                            "hint": "Enter the full legal name of the customer",
                            "class": "flex flex-col"
                        },
                        {
                            "tag": "Itext",
                            "type": "Editable",
                            "title": "Email",
                            "value": "",
                            "var": "customer_email",
                            "hint": "Primary email address for customer communications",
                            "class": "flex flex-col"
                        }
                    ]
                },
                {
                    "tag": "IChoice",
                    "type": "Editable",
                    "title": "Status",
                    "value": "",
                    "choices": ["pending", "in_progress", "completed", "cancelled"],
                    "hint": "Current status of the customer request or project",
                    "class": "flex flex-col"
                },
                {
                    "tag": "IBool",
                    "type": "Editable",
                    "title": "Priority",
                    "value": "false",
                    "hint": "Mark as high priority for urgent requests",
                    "class": "flex flex-row items-center gap-2"
                },
                // Conditional section - only shows when status is "in_progress" or "completed"
                {
                    "tag": "div",
                    "class": "flex flex-col gap-2 p-3 bg-gray-50 rounded",
                    "visibleWhen": {
                        "anyOf": [
                            {"path": "0.2", "op": "equals", "value": "in_progress"},
                            {"path": "0.2", "op": "equals", "value": "completed"}
                        ]
                    },
                    "children": [
                        {
                            "tag": "p",
                            "value": "Progress Details",
                            "class": "font-medium text-gray-700"
                        },
                        {
                            "tag": "Imultiline",
                            "type": "Editable",
                            "title": "Notes",
                            "value": "",
                            "hint": "Add any additional notes or progress updates here",
                            "class": "flex flex-col"
                        }
                    ]
                },
                // Priority warning - only shows when priority is true
                {
                    "tag": "div",
                    "class": "p-3 bg-red-100 border border-red-300 rounded",
                    "visibleWhen": {
                        "path": "0.3",
                        "op": "isTrue"
                    },
                    "children": [
                        {
                            "tag": "p",
                            "value": "⚠️ High Priority Task",
                            "class": "text-red-800 font-medium"
                        }
                    ]
                },
                // Action buttons
                {
                    "tag": "div",
                    "class": "flex flex-row gap-2 justify-end",
                    "children": [
                        {
                            "tag": "Ibutton",
                            "type": "Editable",
                            "title": "Reset",
                            "value": "",
                            "onClick": {
                                "action": "reset",
                                "target": "parent"
                            },
                            "class": "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        },
                        {
                            "tag": "I_V_Button",
                            "type": "Editable",
                            "title": "Save",
                            "value": "",
                            "variant": "success",
                            "size": "default",
                            "onClick": {
                                "action": "save",
                                "target": "parent"
                            }
                        },
                        {
                            "tag": "I_V_Button",
                            "type": "Editable",
                            "title": "View Details",
                            "value": "https://example.com/details",
                            "variant": "outline",
                            "size": "default",
                            "onClick": {
                                "action": "navigate",
                                "value": "https://example.com/details"
                            }
                        }
                    ]
                }
            ]
        }
    ]);

    const globalVars = {
        "customer_name": "John Doe",
        "customer_email": "john.doe@example.com",
        "customer_id": "12345",
        "organization": "Example Corp",
        "misc": [
            {"last_updated": "2024-01-15"},
            {"created_by": "admin"}
        ]
    };

    const handleSave = (updatedCard) => {
        console.log('Card saved:', updatedCard);
        // Here you would typically send the data to your API
        alert('Card saved successfully!');
    };

    const handleCustomEvent = (event, template, setTemplate, globalVars, onSave) => {
        console.log('Custom event received:', event);
        
        // Handle custom events
        switch (event.action) {
            case 'custom_action':
                console.log('Custom action triggered');
                break;
            default:
                // Fall back to default event handling
                console.log('Using default event handling');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Card Template Example</h1>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="font-semibold mb-2">Features Demonstrated:</h2>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Conditional visibility based on component values</li>
                    <li>• Event handlers for buttons (save, reset, navigate)</li>
                    <li>• Variable resolution from globalVars</li>
                    <li>• Dynamic styling and layout</li>
                    <li>• Interactive components with real-time updates</li>
                    <li>• Help tooltips with hint property for better UX</li>
                </ul>
            </div>

            <CardTemplateRenderer
                jsonTemplate={cardJson}
                globalVars={globalVars}
                onChange={setCardJson}
                onSave={handleSave}
                onEvent={handleCustomEvent}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Card State:</h3>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(cardJson, null, 2)}
                </pre>
            </div>
        </div>
    );
}

/**
 * Example of a more complex card with nested conditions and multiple event types
 */
export function AdvancedCardTemplateExample() {
    const [advancedCard, setAdvancedCard] = useState([
        {
            "tag": "div",
            "class": "flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg border",
            "children": [
                {
                    "tag": "div",
                    "class": "flex flex-row justify-between items-center",
                    "children": [
                        {
                            "tag": "h2",
                            "value": "Task Management Card",
                            "class": "text-xl font-bold text-gray-800"
                        },
                        {
                            "tag": "IChoice",
                            "type": "Editable",
                            "title": "Task Type",
                            "value": "",
                            "choices": ["bug", "feature", "maintenance", "documentation"],
                            "hint": "Select the type of task to show relevant fields",
                            "class": "w-48"
                        }
                    ]
                },
                {
                    "tag": "Itext",
                    "type": "Editable",
                    "title": "Task Title",
                    "value": "",
                    "hint": "Enter a clear, descriptive title for the task",
                    "class": "flex flex-col"
                },
                {
                    "tag": "Imultiline",
                    "type": "Editable",
                    "title": "Description",
                    "value": "",
                    "hint": "Provide detailed description of what needs to be done",
                    "class": "flex flex-col"
                },
                // Bug-specific fields
                {
                    "tag": "div",
                    "class": "flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded",
                    "visibleWhen": {
                        "path": "0.0.1",
                        "op": "equals",
                        "value": "bug"
                    },
                    "children": [
                        {
                            "tag": "p",
                            "value": "Bug Report Details",
                            "class": "font-semibold text-red-800"
                        },
                        {
                            "tag": "IChoice",
                            "type": "Editable",
                            "title": "Severity",
                            "value": "",
                            "choices": ["low", "medium", "high", "critical"],
                            "class": "flex flex-col"
                        },
                        {
                            "tag": "Itext",
                            "type": "Editable",
                            "title": "Steps to Reproduce",
                            "value": "",
                            "class": "flex flex-col"
                        }
                    ]
                },
                // Feature-specific fields
                {
                    "tag": "div",
                    "class": "flex flex-col gap-3 p-4 bg-green-50 border border-green-200 rounded",
                    "visibleWhen": {
                        "path": "0.0.1",
                        "op": "equals",
                        "value": "feature"
                    },
                    "children": [
                        {
                            "tag": "p",
                            "value": "Feature Request Details",
                            "class": "font-semibold text-green-800"
                        },
                        {
                            "tag": "IChoice",
                            "type": "Editable",
                            "title": "Priority",
                            "value": "",
                            "choices": ["low", "medium", "high"],
                            "class": "flex flex-col"
                        },
                        {
                            "tag": "Imultiline",
                            "type": "Editable",
                            "title": "Acceptance Criteria",
                            "value": "",
                            "class": "flex flex-col"
                        }
                    ]
                },
                // Status and assignment section
                {
                    "tag": "div",
                    "class": "grid grid-cols-2 gap-4",
                    "children": [
                        {
                            "tag": "IChoice",
                            "type": "Editable",
                            "title": "Status",
                            "value": "",
                            "choices": ["todo", "in_progress", "review", "done"],
                            "class": "flex flex-col"
                        },
                        {
                            "tag": "Itext",
                            "type": "Editable",
                            "title": "Assigned To",
                            "value": "",
                            "var": "assigned_user",
                            "class": "flex flex-col"
                        }
                    ]
                },
                // Action buttons with conditional visibility
                {
                    "tag": "div",
                    "class": "flex flex-row gap-2 justify-between",
                    "children": [
                        {
                            "tag": "I_V_Button",
                            "type": "Editable",
                            "title": "Start Task",
                            "value": "",
                            "variant": "default",
                            "size": "default",
                            "visibleWhen": {
                                "path": "0.4.0",
                                "op": "equals",
                                "value": "todo"
                            },
                            "onClick": {
                                "action": "update",
                                "target": "0.4.0",
                                "value": "in_progress"
                            }
                        },
                        {
                            "tag": "I_V_Button",
                            "type": "Editable",
                            "title": "Mark Complete",
                            "value": "",
                            "variant": "success",
                            "size": "default",
                            "visibleWhen": {
                                "anyOf": [
                                    {"path": "0.4.0", "op": "equals", "value": "in_progress"},
                                    {"path": "0.4.0", "op": "equals", "value": "review"}
                                ]
                            },
                            "onClick": {
                                "action": "update",
                                "target": "0.4.0",
                                "value": "done"
                            }
                        },
                        {
                            "tag": "I_V_Button",
                            "type": "Editable",
                            "title": "Save",
                            "value": "",
                            "variant": "outline",
                            "size": "default",
                            "onClick": {
                                "action": "save",
                                "target": "parent"
                            }
                        }
                    ]
                }
            ]
        }
    ]);

    const taskGlobalVars = {
        "assigned_user": "John Developer",
        "project": "Velia Platform",
        "team": "Frontend Team",
        "misc": [
            {"created_date": "2024-01-15"},
            {"last_modified": "2024-01-15"}
        ]
    };

    const handleTaskSave = (updatedCard) => {
        console.log('Task card saved:', updatedCard);
        alert('Task saved successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Advanced Card Template Example</h1>
            
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h2 className="font-semibold mb-2">Advanced Features:</h2>
                <ul className="text-sm text-green-800 space-y-1">
                    <li>• Nested conditional visibility based on task type</li>
                    <li>• Dynamic form sections (bug vs feature fields)</li>
                    <li>• Conditional action buttons based on status</li>
                    <li>• Complex event handling with value updates</li>
                    <li>• Grid layouts and responsive design</li>
                    <li>• Help tooltips with contextual hints</li>
                </ul>
            </div>

            <CardTemplateRenderer
                jsonTemplate={advancedCard}
                globalVars={taskGlobalVars}
                onChange={setAdvancedCard}
                onSave={handleTaskSave}
            />

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Current Task State:</h3>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                    {JSON.stringify(advancedCard, null, 2)}
                </pre>
            </div>
        </div>
    );
}


import React, { useState } from 'react';

/**
 * IChoice Component - Renders a custom dropdown with selectable options
 * @param {Object} props
 * @param {string} props.title - Label displayed above the dropdown
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - Currently selected value
 * @param {Array} props.choices - Array of available choices
 * @param {string} props.className - CSS class name
 * @param {Function} props.onChange - Callback when selection changes
 */
export function IChoice({ title, type, value, choices = [], className = '', onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <div className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-500">
                    {value || (title ? `Select ${title.toLowerCase()}` : 'Select an option')}
                </div>
            </div>
        );
    } else {
        // Editable or standard - Custom dropdown
        return (
            <div className={className || ''} style={{ position: 'relative' }}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                    >
                        <span>{value || (title ? `Select ${title.toLowerCase()}` : 'Select an option')}</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            <div
                                className="px-2 py-1 text-sm text-gray-500 cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    console.log('IChoice clear selection clicked');
                                    onChange('');
                                    setIsOpen(false);
                                }}
                            >
                                {title ? `Select ${title.toLowerCase()}` : 'Select an option'}
                            </div>
                            {choices.map((choice, index) => (
                                <div
                                    key={index}
                                    className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        console.log('IChoice selection clicked:', choice);
                                        onChange(choice);
                                        setIsOpen(false);
                                    }}
                                >
                                    {choice}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

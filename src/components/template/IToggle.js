import React from 'react';

/**
 * IToggle Component - Renders a toggle button group where only one option can be selected
 * @param {Object} props
 * @param {string} props.title - Label displayed above the toggle buttons
 * @param {string} props.type - "editable" or "display" mode
 * @param {string|number} props.value - Currently selected option
 * @param {Array} props.options - Array of available options
 * @param {string} props.className - CSS class name
 * @param {Function} props.onChange - Callback when selection changes
 */
export function IToggle({ title, type, value, options = [], className = '', onChange }) {
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && <div className="mb-1 text-sm font-medium text-gray-700">{title}</div>}
                <div className="flex flex-row gap-4">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            className={
                                "px-4 py-2 rounded border " +
                                (value === option
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed")
                            }
                            disabled
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    } else {
        // Editable or standard
        return (
            <div className={className || ''}>
                {title && <div className="mb-1 text-sm font-medium text-gray-700">{title}</div>}
                <div className="flex flex-row gap-4">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className={
                                "px-4 py-2 rounded border transition-colors " +
                                (value === option
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200")
                            }
                            onClick={() => {
                                console.log('IToggle option selected:', option);
                                onChange(option);
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}

import React from 'react';

/**
 * IBool Component - Renders a checkbox input
 * @param {Object} props
 * @param {string} props.title - Label displayed next to the checkbox
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - Current checkbox state ("true" or "false")
 * @param {string} props.className - CSS class name
 * @param {Function} props.onChange - Callback when checkbox state changes
 */
export function IBool({ title, type, value, className = '', onChange }) {
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <input
                    type="checkbox"
                    checked={value === "true"}
                    readOnly
                    className="accent-black"
                    style={{ pointerEvents: 'none' }}
                />
            </div>
        );
    } else {
        // Editable or standard
        return (
            <div className={className || ''}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <input
                    type="checkbox"
                    checked={value === "true"}
                    onChange={e => {
                        console.log('IBool onChange triggered:', e.target.checked ? "true" : "false");
                        onChange(e.target.checked ? "true" : "false");
                    }}
                    className="accent-black"
                />
            </div>
        );
    }
}

import React from 'react';

/**
 * Itext Component - Renders a text input field
 * @param {Object} props
 * @param {string} props.title - Label displayed above the input
 * @param {string} props.type - "editable", "display", or standard mode
 * @param {string} props.value - Current input value
 * @param {string} props.className - CSS class name
 * @param {Function} props.onChange - Callback when input value changes
 */
export function Itext({ title, type, value, className = '', onChange }) {
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <input
                    type="text"
                    value={value || ''}
                    readOnly
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-1"
                    placeholder={title ? title.toLowerCase() : ''}
                />
            </div>
        );
    } else {
        // Editable or standard
        return (
            <div className={className || ''}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <input
                    type="text"
                    value={value || ''}
                    onChange={e => {
                        console.log('Itext onChange triggered:', e.target.value);
                        onChange(e.target.value);
                    }}
                    className="border border-gray-300 rounded px-2 py-1"
                    placeholder={title ? title.toLowerCase() : ''}
                />
            </div>
        );
    }
}

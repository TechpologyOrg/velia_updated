import React from 'react';
import V_Tooltip from '../V_Tooltip';

/**
 * IBool Component - Renders a checkbox input
 * @param {Object} props
 * @param {string} props.title - Label displayed next to the checkbox
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - Current checkbox state ("true" or "false")
 * @param {string} props.className - CSS class name
 * @param {string} props.hint - Optional tooltip text for help
 * @param {Function} props.onChange - Callback when checkbox state changes
 */
export function IBool({ title, type, value, className = '', onChange, onClick, hint }) {
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && (
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                        {title}
                        {hint && <V_Tooltip hint={hint} position="top" />}
                    </label>
                )}
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
                {title && (
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                        {title}
                        {hint && <V_Tooltip hint={hint} position="top" />}
                    </label>
                )}
                <input
                    type="checkbox"
                    checked={value === "true"}
                    onChange={e => {
                        console.log('IBool onChange triggered:', e.target.checked ? "true" : "false");
                        onChange(e.target.checked ? "true" : "false");
                    }}
                    onClick={onClick}
                    className="accent-black"
                />
            </div>
        );
    }
}

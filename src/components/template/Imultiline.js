import React from 'react';
import V_Tooltip from '../V_Tooltip';

/**
 * Imultiline Component - Renders a multiline text input (textarea)
 * @param {Object} props
 * @param {string} props.title - Label displayed above the textarea
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - Current text value
 * @param {string} props.className - CSS class name
 * @param {string} props.hint - Optional tooltip text for help
 * @param {Function} props.onChange - Callback when text changes
 */
export function Imultiline({ title, type, value, className = '', onChange, hint }) {
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={className || ''}>
                {title && (
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                        {title}
                        {hint && <V_Tooltip hint={hint} position="top" />}
                    </label>
                )}
                <textarea
                    value={value || ''}
                    readOnly
                    rows={4}
                    className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 resize-none"
                    placeholder={title ? title.toLowerCase() : ''}
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
                <textarea
                    value={value || ''}
                    onChange={e => {
                        console.log('Imultiline onChange triggered:', e.target.value);
                        onChange(e.target.value);
                    }}
                    rows={4}
                    className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                    placeholder={title ? title.toLowerCase() : ''}
                />
            </div>
        );
    }
}

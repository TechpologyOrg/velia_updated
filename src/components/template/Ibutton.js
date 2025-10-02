import React from 'react';

/**
 * Ibutton Component - Renders a clickable button
 * @param {Object} props
 * @param {string} props.title - Button text/label
 * @param {string} props.type - "editable" or "display" mode
 * @param {string} props.value - URL or action value for the button
 * @param {string} props.className - CSS class name
 * @param {string} props.var - Variable name for dynamic value resolution
 */
export function Ibutton({ title, type, value, className = '', var: varName, onClick }) {
    console.log('Rendering Ibutton with:', { title, value, var: varName });
    
    if (type && type.toLowerCase() === 'display') {
        return (
            <div className={(className || '') + ' gap-2 flex flex-row items-center'}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <button
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
                    disabled
                >
                    {title || 'Button'}
                </button>
            </div>
        );
    } else {
        // Editable or standard
        return (
            <div className={(className || '') + ' gap-2 flex flex-row items-center'}>
                {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    onClick={() => {
                        console.log('Ibutton clicked, value:', value, 'var:', varName);
                        if (onClick) {
                            onClick();
                        } else {
                            window.open(value || '#', '_blank');
                        }
                    }}
                >
                    {title || 'Button'}
                </button>
            </div>
        );
    }
}

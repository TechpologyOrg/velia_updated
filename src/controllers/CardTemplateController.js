import React, { useState, useEffect, useCallback } from 'react';

/**
 * Recursively resolves "var" keys in the json array using globalVars.
 * Mutates a copy of the input json.
 */
function resolveVars(json, globalVars) {
    function getVarValue(varKey) {
        if (globalVars && varKey in globalVars) {
            return globalVars[varKey];
        }
        if (globalVars && globalVars.misc && Array.isArray(globalVars.misc)) {
            for (const miscObj of globalVars.misc) {
                if (varKey in miscObj) {
                    return miscObj[varKey];
                }
            }
        }
        return '';
    }

    function traverse(obj) {
        if (Array.isArray(obj)) {
            return obj.map(traverse);
        } else if (obj && typeof obj === 'object') {
            let newObj = { ...obj };
            if ('var' in newObj) {
                const val = getVarValue(newObj['var']);
                newObj.value = val;
            }
            if (newObj.children) {
                newObj.children = traverse(newObj.children);
            }
            return newObj;
        }
        return obj;
    }

    return traverse(json);
}

/**
 * Main component for rendering and managing the JSON template.
 * @param {Array} props.jsonTemplate - The JSON array describing the template.
 * @param {Object} props.globalVars - The global variables object.
 * @param {Function} props.onChange - Callback to parent with updated JSON.
 */
export function CardTemplateRenderer({ jsonTemplate, globalVars, onChange }) {
    // We keep a local state for the working JSON, so we can update values as user interacts
    const [templateState, setTemplateState] = useState(() =>
        resolveVars(jsonTemplate, globalVars)
    );

    // If jsonTemplate or globalVars change, re-resolve and reset state
    useEffect(() => {
        setTemplateState(resolveVars(jsonTemplate, globalVars));
    }, [jsonTemplate, globalVars]);

    // Notify parent of changes
    useEffect(() => {
        if (onChange) {
            onChange(templateState);
        }
    }, [templateState, onChange]);

    // Helper to update a value at a given path in the templateState
    const updateValueAtPath = useCallback((path, newValue) => {
        function update(obj, idx = 0) {
            if (idx === path.length - 1) {
                // At the target object
                return { ...obj, value: newValue };
            }
            if (obj.children && Array.isArray(obj.children)) {
                const childIdx = path[idx + 1];
                return {
                    ...obj,
                    children: obj.children.map((child, i) =>
                        i === childIdx ? update(child, idx + 1) : child
                    ),
                };
            }
            return obj;
        }
        setTemplateState(prev => {
            // path[0] is the index in the root array
            if (Array.isArray(prev)) {
                const rootIdx = path[0];
                return prev.map((item, i) =>
                    i === rootIdx ? update(item, 0) : item
                );
            }
            return prev;
        });
    }, []);

    // Recursive renderer
    function renderNode(node, path = []) {
        if (Array.isArray(node)) {
            return node.map((child, idx) => renderNode(child, [...path, idx]));
        }
        if (!node || typeof node !== 'object') return null;

        const { tag, class: className, title, type, value, children } = node;

        // Interactable tags
        if (tag && tag.startsWith('I')) {
            // Itext
            if (tag === 'Itext') {
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
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
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <input
                                type="text"
                                value={value || ''}
                                onChange={e => updateValueAtPath(path, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                                placeholder={title ? title.toLowerCase() : ''}
                            />
                        </div>
                    );
                }
            }
            // IBool
            if (tag === 'IBool') {
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <input
                                type="checkbox"
                                checked={!!value}
                                readOnly
                                className="accent-black"
                                style={{ pointerEvents: 'none' }}
                            />
                        </div>
                    );
                } else {
                    // Editable or standard
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <input
                                type="checkbox"
                                checked={!!value}
                                onChange={e => updateValueAtPath(path, e.target.checked)}
                                className="accent-black"
                            />
                        </div>
                    );
                }
            }
            // Ibutton
            if (tag === 'Ibutton') {
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
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
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                onClick={() => window.open(value || '#', '_blank')}
                            >
                                {title || 'Button'}
                            </button>
                        </div>
                    );
                }
            }
            // Imultiline
            if (tag === 'Imultiline') {
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
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
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <textarea
                                value={value || ''}
                                onChange={e => updateValueAtPath(path, e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                                placeholder={title ? title.toLowerCase() : ''}
                            />
                        </div>
                    );
                }
            }
            // IChoice
            if (tag === 'IChoice') {
                const choices = node.choices || [];
                console.log('IChoice render:', { choices, value, title }); // Debug log
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <select
                                value={value || ''}
                                disabled
                                className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-500"
                            >
                                <option value="">{title ? `Select ${title.toLowerCase()}` : 'Select an option'}</option>
                                {choices.map((choice, index) => (
                                    <option key={index} value={choice}>
                                        {choice}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                } else {
                    // Editable or standard
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <select
                                value={value || ''}
                                onChange={e => updateValueAtPath(path, e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white relative z-10"
                                style={{ position: 'relative', zIndex: 10 }}
                            >
                                <option value="">{title ? `Select ${title.toLowerCase()}` : 'Select an option'}</option>
                                {choices.map((choice, index) => (
                                    <option key={index} value={choice}>
                                        {choice}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }
            }
            // Add more interactable tags as needed
        }

        // Standard HTML tags
        const Tag = tag || 'div';
        return (
            <Tag key={path.join('-')} className={className || ''}>
                {title && <div className="mb-1 text-sm font-medium text-gray-700">{title}</div>}
                {value && value}
                {children && renderNode(children, [...path, 'children'])}
            </Tag>
        );
    }

    return (
        <div className='w-full h-full'>
            {renderNode(templateState)}
        </div>
    );
}

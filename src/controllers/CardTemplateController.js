import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Recursively resolves "var" keys in the json array using globalVars.
 * Mutates a copy of the input json.
 */
function resolveVars(json, globalVars) {
    if (!json || !Array.isArray(json)) {
        return [];
    }
    
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
                // Only resolve the var if the value is empty or hasn't been set by user
                if (!newObj.value || newObj.value === '') {
                    const val = getVarValue(newObj['var']);
                    newObj.value = val;
                }
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
export function CardTemplateRenderer({ jsonTemplate, globalVars, onChange, onSave }) {
    console.log('CardTemplateRenderer props:', { jsonTemplate, globalVars });
    
    // We keep a local state for the working JSON, so we can update values as user interacts
    const [templateState, setTemplateState] = useState(() => {
        const resolved = resolveVars(jsonTemplate || [], globalVars);
        console.log('Initial templateState:', resolved);
        return resolved;
    });
    
    // Store dropdown open states
    const [openDropdowns, setOpenDropdowns] = useState(new Set());
    
    // Store the latest onChange function in a ref to avoid infinite re-renders
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // If jsonTemplate or globalVars change, re-resolve and reset state
    useEffect(() => {
        const resolvedTemplate = resolveVars(jsonTemplate || [], globalVars);
        // Only update if the resolved template is actually different from current state
        setTemplateState(prevState => {
            // Deep compare to avoid unnecessary updates
            if (JSON.stringify(prevState) !== JSON.stringify(resolvedTemplate)) {
                return resolvedTemplate;
            }
            return prevState;
        });
    }, [jsonTemplate, globalVars]);

    // Helper to update a value at a given path in the templateState
    const updateValueAtPath = useCallback((path, newValue) => {
        console.log('updateValueAtPath called with:', { path, newValue });
        
        function update(obj, pathIndex = 0) {
            if (pathIndex === path.length - 1) {
                // At the target object
                console.log('Updating object at path:', path, 'with value:', newValue);
                return { ...obj, value: newValue };
            }
            
            const currentPathIndex = path[pathIndex];
            
            if (Array.isArray(obj)) {
                // Handle array case
                return obj.map((item, i) => 
                    i === currentPathIndex ? update(item, pathIndex + 1) : item
                );
            } else if (obj && typeof obj === 'object' && obj.children && Array.isArray(obj.children)) {
                // Handle object with children array
                return {
                    ...obj,
                    children: obj.children.map((child, i) =>
                        i === currentPathIndex ? update(child, pathIndex + 1) : child
                    ),
                };
            }
            
            return obj;
        }
        
        setTemplateState(prev => {
            if (Array.isArray(prev)) {
                const newState = update(prev, 0);
                console.log('New state:', newState);
                // Call onChange with the new state when user makes changes
                if (onChangeRef.current) {
                    onChangeRef.current(newState);
                }
                return newState;
            }
            return prev;
        });
    }, []);

    // Helper to toggle dropdown state
    const toggleDropdown = useCallback((path) => {
        setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            const pathKey = path.join('-');
            if (newSet.has(pathKey)) {
                newSet.delete(pathKey);
            } else {
                newSet.add(pathKey);
            }
            return newSet;
        });
    }, []);

    // Helper to close dropdown
    const closeDropdown = useCallback((path) => {
        setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            newSet.delete(path.join('-'));
            return newSet;
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
                                onChange={e => {
                                    console.log('Itext onChange triggered:', e.target.value);
                                    updateValueAtPath(path, e.target.value);
                                }}
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
                                onChange={e => {
                                    console.log('IBool onChange triggered:', e.target.checked);
                                    updateValueAtPath(path, e.target.checked);
                                }}
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
                        <div key={path.join('-')} className={(className || '') + ' gap-2 flex flex-row items-center'}>
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
                        <div key={path.join('-')} className={(className || '') + ' gap-2 flex flex-row items-center'}>
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
                                onChange={e => {
                                    console.log('Imultiline onChange triggered:', e.target.value);
                                    updateValueAtPath(path, e.target.value);
                                }}
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
                const pathKey = path.join('-');
                const isOpen = openDropdowns.has(pathKey);
                
                if (type && type.toLowerCase() === 'display') {
                    return (
                        <div key={path.join('-')} className={className || ''}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <div className="w-full bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-500">
                                {value || (title ? `Select ${title.toLowerCase()}` : 'Select an option')}
                            </div>
                        </div>
                    );
                } else {
                    // Editable or standard - Custom dropdown
                    return (
                        <div key={path.join('-')} className={className || ''} style={{ position: 'relative' }}>
                            {title && <label className="mb-1 text-sm font-medium text-gray-700">{title}</label>}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown(path)}
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
                                                updateValueAtPath(path, '');
                                                closeDropdown(path);
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
                                                    updateValueAtPath(path, choice);
                                                    closeDropdown(path);
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
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="text-sm text-gray-600 mb-2">Debug: Test interactive elements</p>
                <button 
                    className='bg-green-500 text-white px-4 py-2 rounded-md mr-2' 
                    onClick={() => {
                        console.log('Test button clicked');
                        updateValueAtPath([0, 0, 0], 'Test Value');
                    }}
                >
                    Test Update First Field
                </button>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => onSave(templateState)}>Save</button>
            </div>
        </div>
    );
}

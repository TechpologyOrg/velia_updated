import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IToggle, Imultiline, IChoice, IBool, Itext, Ibutton, I_V_Button } from '../components/template';

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
                // Only resolve the var if the value is empty, hasn't been set by user, or is the default "#"
                if (!newObj.value || newObj.value === '' || newObj.value === '#') {
                    const val = getVarValue(newObj['var']);
                    console.log(`Resolving var "${newObj['var']}" to:`, val, 'for tag:', newObj.tag);
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
        
        setTemplateState(prev => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep clone
            let current = newState;
            
            // Navigate to the target object
            for (let i = 0; i < path.length - 1; i++) {
                const pathElement = path[i];
                if (current && current[pathElement]) {
                    if (pathElement === 'children') {
                        current = current.children;
                    } else {
                        current = current[pathElement];
                    }
                } else {
                    console.error('Invalid path:', path);
                    return prev;
                }
            }
            
            // Update the value of the target object
            const targetIndex = path[path.length - 1];
            if (current && current[targetIndex]) {
                current[targetIndex].value = newValue;
            }
            
            console.log('New state:', newState);
            // Call onChange with the new state when user makes changes
            if (onChangeRef.current) {
                onChangeRef.current(newState);
            }
            return newState;
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
                return (
                    <Itext
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        className={className}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
            }
            // IBool
            if (tag === 'IBool') {
                return (
                    <IBool
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        className={className}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
            }
            // Ibutton
            if (tag === 'Ibutton') {
                return (
                    <Ibutton
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        className={className}
                        var={node.var}
                    />
                );
            }
            // Imultiline
            if (tag === 'Imultiline') {
                return (
                    <Imultiline
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        className={className}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
            }
            // IChoice
            if (tag === 'IChoice') {
                return (
                    <IChoice
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        choices={node.choices || []}
                        className={className}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
            }
            // IToggle
            if (tag === 'IToggle') {
                return (
                    <IToggle
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        options={node.options || []}
                        className={className}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
            }
            // I_V_Button
            if (tag === 'I_V_Button') {
                return (
                    <I_V_Button
                        key={path.join('-')}
                        title={title}
                        type={type}
                        value={value}
                        className={className}
                        variant={node.variant}
                        size={node.size}
                        var={node.var}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                    />
                );
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
            <div className="mt-4 p-4 bg-gray-100 rounded items-center justify-end flex">
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => onSave(templateState)}>Save</button>
            </div>
        </div>
    );
}

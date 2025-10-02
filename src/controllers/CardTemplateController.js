import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
 * CARD TEMPLATE EVENT SYSTEM DOCUMENTATION
 * ========================================
 * 
 * The card template event system supports conditional visibility, dynamic styling,
 * and event-driven interactions for card components.
 * 
 * VISIBILITY CONDITION STRUCTURES:
 * --------------------------------
 * 
 * 1. Single Condition:
 *    {
 *      "visibleWhen": {
 *        "path": "0.1",           // component path (array index or component ID)
 *        "op": "equals",          // operator
 *        "value": "some value"    // comparison value
 *      }
 *    }
 * 
 * 2. OR Logic (anyOf):
 *    {
 *      "visibleWhen": {
 *        "anyOf": [
 *          {"path": "0.1", "op": "equals", "value": "option1"},
 *          {"path": "0.1", "op": "equals", "value": "option2"}
 *        ]
 *      }
 *    }
 * 
 * 3. AND Logic (allOf):
 *    {
 *      "visibleWhen": {
 *        "allOf": [
 *          {"path": "0.1", "op": "equals", "value": "employed"},
 *          {"path": "0.2", "op": "greaterThan", "value": "18"}
 *        ]
 *      }
 *    }
 * 
 * 4. NOT Logic:
 *    {
 *      "visibleWhen": {
 *        "not": {"path": "0.1", "op": "equals", "value": "student"}
 *      }
 *    }
 * 
 * SUPPORTED OPERATORS:
 * -------------------
 * - equals: String equality
 * - notEquals: String inequality
 * - contains: String contains
 * - notContains: String does not contain
 * - greaterThan: Numeric greater than
 * - lessThan: Numeric less than
 * - greaterThanOrEqual: Numeric >=
 * - lessThanOrEqual: Numeric <=
 * - isEmpty: Value is empty/null/undefined
 * - isNotEmpty: Value has content
 * - isTrue: Boolean true
 * - isFalse: Boolean false
 * 
 * PATH FORMATS:
 * -------------
 * - "0.1": Component path (array index 0, child index 1)
 * - "component_id": Component ID reference
 * - "vars.variable_name": Variable reference
 * 
 * EVENT HANDLERS:
 * ---------------
 * Components can have event handlers that trigger actions:
 * 
 * {
 *   "tag": "Ibutton",
 *   "title": "Submit",
 *   "onClick": {
 *     "action": "save",
 *     "target": "parent" // or specific component path
 *   }
 * }
 * 
 * SUPPORTED ACTIONS:
 * -----------------
 * - save: Save the current card state
 * - reset: Reset component values
 * - toggle: Toggle visibility of target component
 * - update: Update target component value
 * - navigate: Navigate to URL
 * - custom: Custom action (requires handler)
 * 
 * DYNAMIC STYLING:
 * ---------------
 * Components can have conditional styling:
 * 
 * {
 *   "tag": "Itext",
 *   "title": "Status",
 *   "value": "pending",
 *   "styleWhen": {
 *     "path": "0.1",
 *     "op": "equals",
 *     "value": "completed",
 *     "style": "text-green-600 font-bold"
 *   }
 * }
 */

// Centralized visibility evaluation functions
const evaluateVisibilityCondition = (condition, template, vars) => {
    if (!condition || !template) {
        console.log('Card visibility condition evaluation skipped:', { condition, template: !!template });
        return false;
    }
    
    const { path, op, value } = condition;
    
    // Handle different path formats
    let targetValue = null;
    
    if (path.includes('.')) {
        // Component path: "0.1" (array index, child index)
        const pathParts = path.split('.');
        let current = template;
        
        for (const part of pathParts) {
            const index = parseInt(part);
            if (Array.isArray(current) && current[index]) {
                current = current[index];
            } else {
                console.log('Invalid path in card template:', path);
                return false;
            }
        }
        
        targetValue = current?.value;
        console.log('Card component visibility check:', { 
            path, 
            component: current?.tag, 
            targetValue, 
            expectedValue: value 
        });
    } else if (path.startsWith('vars.')) {
        // Variable reference: "vars.variableName"
        const varKey = path.replace('vars.', '');
        targetValue = vars?.[varKey];
        console.log('Card variable visibility check:', { 
            path, 
            varKey, 
            targetValue, 
            expectedValue: value 
        });
    } else {
        // Component ID reference
        const findComponentById = (components, id) => {
            for (const component of components) {
                if (component.id === id) {
                    return component;
                }
                if (component.children) {
                    const found = findComponentById(component.children, id);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const component = findComponentById(template, path);
        targetValue = component?.value;
        console.log('Card component ID visibility check:', { 
            path, 
            component: component?.tag, 
            targetValue, 
            expectedValue: value 
        });
    }
    
    // Handle different operators
    switch (op) {
        case 'equals':
            return String(targetValue) === String(value);
        case 'notEquals':
            return String(targetValue) !== String(value);
        case 'contains':
            return String(targetValue).includes(String(value));
        case 'notContains':
            return !String(targetValue).includes(String(value));
        case 'greaterThan':
            return Number(targetValue) > Number(value);
        case 'lessThan':
            return Number(targetValue) < Number(value);
        case 'greaterThanOrEqual':
            return Number(targetValue) >= Number(value);
        case 'lessThanOrEqual':
            return Number(targetValue) <= Number(value);
        case 'isEmpty':
            return !targetValue || String(targetValue).trim() === '';
        case 'isNotEmpty':
            return targetValue && String(targetValue).trim() !== '';
        case 'isTrue':
            return targetValue === true || targetValue === 'true';
        case 'isFalse':
            return targetValue === false || targetValue === 'false';
        default:
            return false;
    }
};

const evaluateVisibilityConditions = (visibleWhen, template, vars) => {
    if (!visibleWhen) {
        console.log('No card visibility conditions, showing by default');
        return true;
    }
    
    console.log('Evaluating card visibility conditions:', { visibleWhen, templateLength: template?.length, vars });
    
    // Handle different condition structures
    if (visibleWhen.anyOf) {
        // OR logic - any condition can be true
        const result = visibleWhen.anyOf.some(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
        console.log('Card anyOf visibility result:', result);
        return result;
    } else if (visibleWhen.allOf) {
        // AND logic - all conditions must be true
        const results = visibleWhen.allOf.map(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
        const result = results.every(r => r);
        console.log('Card allOf visibility result:', { 
            conditions: visibleWhen.allOf, 
            results, 
            finalResult: result 
        });
        return result;
    } else if (visibleWhen.not) {
        // NOT logic - condition must be false
        const result = !evaluateVisibilityCondition(visibleWhen.not, template, vars);
        console.log('Card not visibility result:', result);
        return result;
    } else {
        // Single condition
        const result = evaluateVisibilityCondition(visibleWhen, template, vars);
        console.log('Card single condition visibility result:', result);
        return result;
    }
};

// Event handler system
const handleCardEvent = (event, template, setTemplate, globalVars, onSave) => {
    console.log('Card event triggered:', event);
    
    const { action, target, value: eventValue } = event;
    
    switch (action) {
        case 'save':
            if (onSave) {
                onSave(template);
            }
            break;
            
        case 'reset':
            // Reset component values
            const resetTemplate = (components) => {
                return components.map(component => {
                    if (component.children) {
                        return {
                            ...component,
                            children: resetTemplate(component.children)
                        };
                    } else if (component.tag && component.tag.startsWith('I')) {
                        return {
                            ...component,
                            value: component.var ? '' : component.value
                        };
                    }
                    return component;
                });
            };
            setTemplate(resetTemplate(template));
            break;
            
        case 'toggle':
            // Toggle visibility of target component
            // This would require modifying the template structure
            console.log('Toggle action not yet implemented');
            break;
            
        case 'update':
            // Update target component value
            if (target && eventValue !== undefined) {
                const updateComponentValue = (components, targetPath, newValue) => {
                    return components.map((component, index) => {
                        if (targetPath === index.toString()) {
                            return { ...component, value: newValue };
                        } else if (component.children) {
                            return {
                                ...component,
                                children: updateComponentValue(component.children, targetPath, newValue)
                            };
                        }
                        return component;
                    });
                };
                setTemplate(updateComponentValue(template, target, eventValue));
            }
            break;
            
        case 'navigate':
            if (eventValue) {
                window.open(eventValue, '_blank');
            }
            break;
            
        case 'custom':
            // Custom action - can be extended
            console.log('Custom action:', event);
            break;
            
        default:
            console.warn('Unknown card event action:', action);
    }
};

/**
 * Main component for rendering and managing the JSON template with event system.
 * @param {Array} props.jsonTemplate - The JSON array describing the template.
 * @param {Object} props.globalVars - The global variables object.
 * @param {Function} props.onChange - Callback to parent with updated JSON.
 * @param {Function} props.onSave - Callback when save is triggered.
 * @param {Function} props.onEvent - Custom event handler.
 */
export function CardTemplateRenderer({ jsonTemplate, globalVars, onChange, onSave, onEvent }) {
    console.log('CardTemplateRenderer props:', { jsonTemplate, globalVars });
    
    // We keep a local state for the working JSON, so we can update values as user interacts
    const [templateState, setTemplateState] = useState(() => {
        const resolved = resolveVars(jsonTemplate || [], globalVars);
        console.log('Initial card templateState:', resolved);
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
        console.log('Card updateValueAtPath called with:', { path, newValue });
        
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
                    console.error('Invalid path in card template:', path);
                    return prev;
                }
            }
            
            // Update the value of the target object
            const targetIndex = path[path.length - 1];
            if (current && current[targetIndex]) {
                current[targetIndex].value = newValue;
            }
            
            console.log('New card state:', newState);
            // Call onChange with the new state when user makes changes
            if (onChangeRef.current) {
                onChangeRef.current(newState);
            }
            return newState;
        });
    }, []);

    // Compute visibility for all components
    const componentVisibility = useMemo(() => {
        const computeVisibility = (components) => {
            return components.map(component => {
                const isVisible = evaluateVisibilityConditions(component.visibleWhen, templateState, globalVars);
                let childrenVisibility = null;
                
                if (component.children) {
                    childrenVisibility = computeVisibility(component.children);
                }
                
                return {
                    component,
                    isVisible,
                    childrenVisibility
                };
            });
        };
        
        return computeVisibility(templateState);
    }, [templateState, globalVars]);

    // Recursive renderer with visibility support
    function renderNode(node, path = [], visibilityInfo = null) {
        if (Array.isArray(node)) {
            return node.map((child, idx) => {
                const childVisibility = visibilityInfo?.[idx];
                return renderNode(child, [...path, idx], childVisibility);
            });
        }
        if (!node || typeof node !== 'object') return null;

        // Check visibility
        if (visibilityInfo && !visibilityInfo.isVisible) {
            return null;
        }

        const { tag, class: className, title, type, value, children, onClick, styleWhen } = node;

        // Handle event clicks
        const handleClick = () => {
            if (onClick) {
                if (onEvent) {
                    onEvent(onClick, templateState, setTemplateState, globalVars, onSave);
                } else {
                    handleCardEvent(onClick, templateState, setTemplateState, globalVars, onSave);
                }
            }
        };

        // Handle dynamic styling
        const getDynamicStyle = () => {
            if (styleWhen) {
                const conditionMet = evaluateVisibilityCondition(styleWhen, templateState, globalVars);
                if (conditionMet) {
                    return `${className || ''} ${styleWhen.style || ''}`.trim();
                }
            }
            return className || '';
        };

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
                        className={getDynamicStyle()}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        var={node.var}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
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
                        className={getDynamicStyle()}
                        variant={node.variant}
                        size={node.size}
                        var={node.var}
                        onChange={(newValue) => updateValueAtPath(path, newValue)}
                        onClick={onClick ? handleClick : undefined}
                    />
                );
            }
            // Add more interactable tags as needed
        }

        // Standard HTML tags
        const Tag = tag || 'div';
        
        // Check if value contains HTML tags and should be rendered as HTML
        const isHtmlContent = value && typeof value === 'string' && /<[^>]*>/g.test(value);
        
        return (
            <Tag 
                key={path.join('-')} 
                className={getDynamicStyle()}
                onClick={onClick ? handleClick : undefined}
                style={{ cursor: onClick ? 'pointer' : 'default' }}
            >
                {title && <div className="mb-1 text-sm font-medium text-gray-700">{title}</div>}
                {value && (
                    isHtmlContent ? (
                        <span dangerouslySetInnerHTML={{ __html: value }} />
                    ) : (
                        value
                    )
                )}
                {children && renderNode(children, [...path, 'children'], visibilityInfo?.childrenVisibility)}
            </Tag>
        );
    }

    return (
        <div className='w-full h-full'>
            {renderNode(templateState, [], componentVisibility)}
            <div className="mt-4 p-4 bg-gray-100 rounded items-center justify-end flex">
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => onSave(templateState)}>Save</button>
            </div>
        </div>
    );
}
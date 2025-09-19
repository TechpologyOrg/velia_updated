import React, {useEffect, useState, useMemo, useCallback} from 'react'
import ReactMarkdown from 'react-markdown'
import V_Input from '../components/V_Input';

/* 
VISIBILITY SYSTEM DOCUMENTATION
================================

The refactored visibility system supports both form-level and question-level visibility conditions.
It properly handles React re-renders and supports cross-form dependencies.

VISIBILITY CONDITION STRUCTURES:
--------------------------------

1. Single Condition:
   {
     "visibleWhen": {
       "path": "0.2",           // formIndex.questionIndex or questionId
       "op": "equals",          // operator
       "value": "some value"    // comparison value
     }
   }

2. OR Logic (anyOf):
   {
     "visibleWhen": {
       "anyOf": [
         {"path": "0.2", "op": "equals", "value": "option1"},
         {"path": "0.2", "op": "equals", "value": "option2"}
       ]
     }
   }

3. AND Logic (allOf):
   {
     "visibleWhen": {
       "allOf": [
         {"path": "0.2", "op": "equals", "value": "employed"},
         {"path": "0.3", "op": "greaterThan", "value": "18"}
       ]
     }
   }

4. NOT Logic:
   {
     "visibleWhen": {
       "not": {"path": "0.2", "op": "equals", "value": "student"}
     }
   }

SUPPORTED OPERATORS:
-------------------
- equals: String equality
- notEquals: String inequality  
- contains: String contains
- notContains: String does not contain
- greaterThan: Numeric greater than
- lessThan: Numeric less than
- greaterThanOrEqual: Numeric >=
- lessThanOrEqual: Numeric <=
- isEmpty: Value is empty/null/undefined
- isNotEmpty: Value has content

PATH FORMATS:
-------------
- "0.2": Cross-form reference (form 0, question with ID 2)
- "0.1": Cross-form reference (form 0, question at index 1) - fallback
- "vars.customer_name": Variable reference
- "123": Question ID reference (searches all forms)

SUPPORTED QUESTION TYPES:
------------------------
- text: Single-line text input (supports placeholder)
- numeric: Number input
- choice: Single selection dropdown
- boolean: Checkbox (true/false)
- date: Date picker
- display: Read-only display field (uses vars)
- toggleList: Multiple selection checkboxes (semicolon-separated values)
- title: Section header/title (styled paragraph)
- paragraph: Display paragraph text (supports line breaks and longer content)
- markdown: Display markdown content (supports headers, lists, links, formatting, etc.)

EXAMPLE TEMPLATE WITH VISIBILITY:
---------------------------------
[
  {
    "id": 0,
    "title": "Personal Information",
    "type": "form",
    "visibleWhen": true,  // Always visible
    "questions": [
      {"id": 0, "title": "Name", "type": "text", "value": ""},
      {"id": 1, "title": "Age", "type": "numeric", "value": 0},
      {
        "id": 2, 
        "title": "Employment Status", 
        "type": "choice", 
        "value": "",
        "choices": ["employed", "student", "unemployed"]
      },
      {
        "id": 3,
        "title": "Skills",
        "type": "toggleList",
        "value": "",
        "choices": ["JavaScript", "Python", "React", "Node.js", "SQL"]
      },
      {
        "id": 8,
        "title": "Section Header",
        "type": "title",
        "value": "Additional Information"
      },
      {
        "id": 9,
        "title": "Information Text",
        "type": "paragraph",
        "value": "This is a paragraph that can contain longer text content. It supports line breaks and is perfect for displaying instructions, descriptions, or any multi-line text content."
      },
      {
        "id": 10,
        "title": "Markdown Content",
        "type": "markdown",
        "value": "## Instructions\n\nPlease complete the following steps:\n\n1. **Fill in your personal information**\n2. *Verify your contact details*\n3. Submit the form\n\n> **Note**: All fields marked with * are required.\n\nFor more information, visit [our website](https://example.com)."
      },
      {
        "id": 4,
        "title": "Company Name",
        "type": "text",
        "value": "",
        "placeholder": "Enter your company name",
        "visibleWhen": {
          "path": "2",
          "op": "equals", 
          "value": "employed"
        }
      },
      {
        "id": 5,
        "title": "Senior Developer",
        "type": "boolean",
        "value": "false",
        "visibleWhen": {
          "path": "3",
          "op": "contains",
          "value": "JavaScript"
        }
      }
    ]
  },
  {
    "id": 1,
    "title": "Employment Details",
    "type": "form",
    "visibleWhen": {
      "path": "0.2",
      "op": "equals",
      "value": "employed"
    },
    "questions": [
      {"id": 6, "title": "Job Title", "type": "text", "value": ""},
      {"id": 7, "title": "Salary", "type": "numeric", "value": 0}
    ]
  }
]
*/

// Centralized visibility evaluation functions
const evaluateVisibilityCondition = (condition, template, vars) => {
    if (!condition || !template) {
        console.log('Visibility condition evaluation skipped:', { condition, template: !!template });
        return false;
    }
    
    const { path, op, value } = condition;
    
    // Handle different path formats
    let targetValue = null;
    
    if (path.includes('.')) {
        // Cross-form reference: "formIndex.questionId" or "formIndex.questionIndex"
        const [formIndex, questionRef] = path.split('.');
        const formIdx = parseInt(formIndex);
        const questionRefNum = parseInt(questionRef);
        
        // Try to find by question ID first, then by index
        let question = template[formIdx]?.questions?.find(q => q.id === questionRefNum);
        if (!question) {
            // Fallback to index-based lookup
            question = template[formIdx]?.questions?.[questionRefNum];
        }
        
        targetValue = question?.value;
        console.log('Cross-form visibility check:', { 
            path, 
            formIndex: formIdx, 
            questionRef, 
            question: question?.title, 
            questionId: question?.id,
            questionType: question?.type,
            targetValue, 
            expectedValue: value 
        });
    } else if (path.startsWith('vars.')) {
        // Variable reference: "vars.variableName"
        const varKey = path.replace('vars.', '');
        targetValue = vars?.[varKey];
        console.log('Variable visibility check:', { 
            path, 
            varKey, 
            targetValue, 
            expectedValue: value 
        });
    } else {
        // Direct question reference within current form
        const questionIndex = parseInt(path);
        const question = template.find(form => 
            form.questions?.some(q => q.id === questionIndex)
        )?.questions?.find(q => q.id === questionIndex);
        targetValue = question?.value;
        console.log('Question ID visibility check:', { 
            path, 
            questionIndex, 
            question: question?.title, 
            targetValue, 
            expectedValue: value,
            questionType: question?.type
        });
    }
    
    // Handle different operators
    switch (op) {
        case 'equals':
            return String(targetValue) === String(value);
        case 'notEquals':
            return String(targetValue) !== String(value);
        case 'contains':
            const containsResult = String(targetValue).includes(String(value));
            console.log('Contains check:', { 
                targetValue: String(targetValue), 
                searchValue: String(value), 
                result: containsResult 
            });
            return containsResult;
        case 'notContains':
            return !String(targetValue).includes(String(value));
        case 'greaterThan':
            return Number(targetValue) > Number(value);
        case 'lessThan':
            return Number(targetValue) < Number(value);
        case 'greaterThanOrEqual':
            const gteResult = Number(targetValue) >= Number(value);
            console.log('GreaterThanOrEqual check:', { 
                targetValue, 
                targetValueNumber: Number(targetValue),
                compareValue: value, 
                compareValueNumber: Number(value),
                result: gteResult 
            });
            return gteResult;
        case 'lessThanOrEqual':
            return Number(targetValue) <= Number(value);
        case 'isEmpty':
            return !targetValue || String(targetValue).trim() === '';
        case 'isNotEmpty':
            return targetValue && String(targetValue).trim() !== '';
        default:
            return false;
    }
};

const evaluateVisibilityConditions = (visibleWhen, template, vars) => {
    if (!visibleWhen) {
        console.log('No visibility conditions, showing by default');
        return true;
    }
    
    console.log('Evaluating visibility conditions:', { visibleWhen, templateLength: template?.length, vars });
    
    // Handle different condition structures
    if (visibleWhen.anyOf) {
        // OR logic - any condition can be true
        const result = visibleWhen.anyOf.some(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
        console.log('anyOf visibility result:', result);
        return result;
    } else if (visibleWhen.allOf) {
        // AND logic - all conditions must be true
        const results = visibleWhen.allOf.map(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
        const result = results.every(r => r);
        console.log('allOf visibility result:', { 
            conditions: visibleWhen.allOf, 
            results, 
            finalResult: result 
        });
        return result;
    } else if (visibleWhen.not) {
        // NOT logic - condition must be false
        const result = !evaluateVisibilityCondition(visibleWhen.not, template, vars);
        console.log('not visibility result:', result);
        return result;
    } else {
        // Single condition
        const result = evaluateVisibilityCondition(visibleWhen, template, vars);
        console.log('single condition visibility result:', result);
        return result;
    }
};

export function GenerateForm({ Form, SetForm, template, vars }) {
    // Use useMemo to compute visibility and trigger re-renders when dependencies change
    const isFormVisible = useMemo(() => {
        return evaluateVisibilityConditions(Form.visibleWhen, template, vars);
    }, [Form.visibleWhen, template, vars]);

    // Compute visibility for all questions - must be called before any early returns
    const questionVisibility = useMemo(() => {
        if (!Form || !Form.questions || !Array.isArray(Form.questions)) {
            return [];
        }
        return Form.questions.map(question => 
            evaluateVisibilityConditions(question.visibleWhen, template, vars)
        );
    }, [Form.questions, template, vars]);

    // Add safety check for Form.questions
    if (!Form || !Form.questions || !Array.isArray(Form.questions)) {
        console.error('GenerateForm: Invalid Form or questions data:', Form);
        return <div>Error: Invalid form data</div>;
    }

    if (!isFormVisible) {
        return null;
    }

    return (
        <div className='flex flex-col w-full p-4'>
            <p className='text-xl font-bold'>{Form.title}</p>
            <p className='text-sm text-neutral-500 mb-4'>{Form.description}</p>

            <div className='flex flex-col w-full gap-4'>
                {Form.questions.map((question, index) => {
                    // Check question-level visibility using pre-computed values
                    const isQuestionVisible = questionVisibility[index];

                    if (!isQuestionVisible) {
                        return null;
                    }
                    if (question.type === 'display') {
                        question.value = vars[question.key];
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <p className="text-sm text-gray-500">{question.value}</p>
                            </div>
                        );
                    } else if (question.type === 'numeric') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <input
                                    type="number"
                                    value={question.value}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.value } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                    }}
                                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-0 py-1 text-base"
                                    style={{ borderRadius: 0 }}
                                />
                            </div>
                        )
                    }else if (question.type === 'text') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <input
                                    type="text"
                                    value={question.value}
                                    placeholder={question.placeholder || ''}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.value } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                    }}
                                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-0 py-1 text-base"
                                    style={{ borderRadius: 0 }}
                                />
                            </div>
                        )
                    } else if (question.type === 'choice') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <select
                                    value={question.value}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.value } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                    }}
                                    className="bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-0 py-1 text-base"
                                    style={{ borderRadius: 0 }}
                                >
                                    {question.choices.map((option, optionIndex) => (
                                        <option key={optionIndex} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        )
                    }else if (question.type === 'boolean') {
                        return (
                            <div key={question.id || index} className='flex flex-row items-center gap-2 w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <input
                                    type="checkbox"
                                    checked={question.value === "true"}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.checked ? "true" : "false" } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                    }}
                                />
                            </div>
                        )
                    }
                    else if(question.type === 'date') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <input
                                    type="date"
                                    value={question.value}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.value } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                    }}
                                />
                            </div>
                        )
                    } else if (question.type === 'toggleList') {
                        // Parse current value (semicolon-separated string)
                        const selectedValues = question.value ? question.value.split(';').filter(v => v.trim() !== '') : [];
                        
                        const handleToggleChange = (choiceValue, isSelected) => {
                            let newSelectedValues;
                            if (isSelected) {
                                // Add to selection
                                newSelectedValues = [...selectedValues, choiceValue];
                            } else {
                                // Remove from selection
                                newSelectedValues = selectedValues.filter(v => v !== choiceValue);
                            }
                            
                            // Convert back to semicolon-separated string
                            const newValue = newSelectedValues.join(';');
                            
                            const updatedForm = {
                                ...Form,
                                questions: Form.questions.map((q, qIndex) =>
                                    qIndex === index ? { ...q, value: newValue } : q
                                )
                            };
                            SetForm(updatedForm);
                        };

                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                <div className="flex flex-col gap-2 mt-2">
                                    {question.choices.map((choice, choiceIndex) => {
                                        const isSelected = selectedValues.includes(choice);
                                        return (
                                            <label key={choiceIndex} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => handleToggleChange(choice, e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">{choice}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {/* Debug info - remove in production */}
                                <div className="mt-2 text-xs text-gray-500">
                                    Selected: {question.value || 'none'}
                                </div>
                            </div>
                        )
                    } else if (question.type === 'title') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full pl-8 mt-6 mb-4'>
                                <p className="text-lg font-semibold text-gray-800">{question.value}</p>
                            </div>
                        )
                    } else if (question.type === 'paragraph') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full pl-8 mt-4 mb-4'>
                                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{question.value}</p>
                            </div>
                        )
                    } else if (question.type === 'markdown') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full pl-8 mt-4 mb-4'>
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>{question.value || ''}</ReactMarkdown>
                                </div>
                            </div>
                        )
                    } else {
                        console.warn('Unknown question type:', question.type, 'for question:', question.title);
                        return (
                            <div key={question.id || index} className='flex flex-col w-full pl-8 mt-4 mb-4'>
                                <p className="text-red-500">Unknown question type: {question.type}</p>
                                <p className="text-gray-700">{question.value}</p>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export function GenerateTemplate({ template, SetTemplate, onFormChange }) {
    console.log('GenerateTemplate received template:', template);
    
    // Defensive copy to avoid mutating the original template
    const safeTemplate = Array.isArray(template.answers) ? template.answers : [];
    console.log('Safe template (answers):', safeTemplate);
    
    const [pageIndex, setPageIndex] = useState(0);
    const [forceUpdate, setForceUpdate] = useState(0);
    
    // Force re-render when template changes to update visibility
    useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [template]);
    
    // Show loading state if template is not properly initialized
    if (!template || !template.answers || template.answers.length === 0) {
        return (
            <div className='flex flex-col w-full items-center justify-center p-8'>
                <div className='text-gray-500'>Loading form...</div>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full'>
            {safeTemplate.map((form, index) => {
                if(index === pageIndex){
                    return (
                        <GenerateForm
                            key={form.id || index}
                            Form={form}
                            vars={template.vars}
                            SetForm={(updatedForm) => {
                                // Always create a new array and new form object to ensure React state updates
                                const updatedTemplate = {
                                    ...template,
                                    answers: safeTemplate.map((f, i) =>
                                        i === index ? { ...updatedForm } : f
                                    )
                                };
                                SetTemplate(updatedTemplate);
                                // Force visibility re-evaluation
                                setForceUpdate(prev => prev + 1);
                                // Notify parent component that form has changed
                                if (onFormChange) {
                                    onFormChange();
                                }
                            }}
                            template={safeTemplate}
                        />
                    )
                }
                return null; // Explicitly return null for non-active indices
            })}
            <div className='flex flex-col w-full items-center justify-center mt-6'>
                <div className='w-full h-2 bg-gray-200 rounded-full mb-4'>
                    <div className='h-full bg-black rounded-full' style={{width: `${(pageIndex / safeTemplate.length) * 100}%`}}></div>
                </div>
                <div className='w-full flex flex-row items-center justify-between'>
                    <button 
                        className='bg-black text-white px-4 py-2 rounded-md' 
                        onClick={() => {setPageIndex(pageIndex - 1)}}
                        disabled={pageIndex === 0}
                    >
                        Back
                    </button>
                    <button 
                        className='bg-black text-white px-4 py-2 rounded-md' 
                        onClick={() => {setPageIndex(pageIndex + 1)}}
                        disabled={pageIndex === safeTemplate.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

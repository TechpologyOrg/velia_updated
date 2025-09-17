import React, {useEffect, useState, useMemo, useCallback} from 'react'
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
- "0.2": Cross-form reference (form 0, question 2)
- "vars.customer_name": Variable reference
- "123": Question ID reference (searches all forms)

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
        "title": "Company Name",
        "type": "text",
        "value": "",
        "visibleWhen": {
          "path": "2",
          "op": "equals", 
          "value": "employed"
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
      {"id": 4, "title": "Job Title", "type": "text", "value": ""},
      {"id": 5, "title": "Salary", "type": "numeric", "value": 0}
    ]
  }
]
*/

// Centralized visibility evaluation functions
const evaluateVisibilityCondition = (condition, template, vars) => {
    if (!condition || !template) return false;
    
    const { path, op, value } = condition;
    
    // Handle different path formats
    let targetValue = null;
    
    if (path.includes('.')) {
        // Cross-form reference: "formIndex.questionIndex"
        const [formIndex, questionIndex] = path.split('.').map(Number);
        const question = template[formIndex]?.questions?.[questionIndex];
        targetValue = question?.value;
    } else if (path.startsWith('vars.')) {
        // Variable reference: "vars.variableName"
        const varKey = path.replace('vars.', '');
        targetValue = vars?.[varKey];
    } else {
        // Direct question reference within current form
        const questionIndex = parseInt(path);
        const question = template.find(form => 
            form.questions?.some(q => q.id === questionIndex)
        )?.questions?.find(q => q.id === questionIndex);
        targetValue = question?.value;
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
        default:
            return false;
    }
};

const evaluateVisibilityConditions = (visibleWhen, template, vars) => {
    if (!visibleWhen) return true;
    
    // Handle different condition structures
    if (visibleWhen.anyOf) {
        // OR logic - any condition can be true
        return visibleWhen.anyOf.some(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
    } else if (visibleWhen.allOf) {
        // AND logic - all conditions must be true
        return visibleWhen.allOf.every(condition => 
            evaluateVisibilityCondition(condition, template, vars)
        );
    } else if (visibleWhen.not) {
        // NOT logic - condition must be false
        return !evaluateVisibilityCondition(visibleWhen.not, template, vars);
    } else {
        // Single condition
        return evaluateVisibilityCondition(visibleWhen, template, vars);
    }
};

export function GenerateForm({ Form, SetForm, template, vars }) {
    // Use useMemo to compute visibility and trigger re-renders when dependencies change
    const isFormVisible = useMemo(() => {
        return evaluateVisibilityConditions(Form.visibleWhen, template, vars);
    }, [Form.visibleWhen, template, vars]);

    // Add safety check for Form.questions
    if (!Form || !Form.questions || !Array.isArray(Form.questions)) {
        console.error('GenerateForm: Invalid Form or questions data:', Form);
        return <div>Error: Invalid form data</div>;
    }

    if (!isFormVisible) {
        return null;
    }

    // Compute visibility for all questions outside the map function
    const questionVisibility = useMemo(() => {
        return Form.questions.map(question => 
            evaluateVisibilityConditions(question.visibleWhen, template, vars)
        );
    }, [Form.questions, template, vars]);

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
                                    checked={question.value}
                                    onChange={(e) => {
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: e.target.checked } : q
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

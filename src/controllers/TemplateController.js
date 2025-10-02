import React, {useEffect, useState, useMemo, useCallback} from 'react'
import ReactMarkdown from 'react-markdown'
import V_Input from '../components/V_Input';
import V_Tooltip from '../components/V_Tooltip';

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
- equals: String equality (also works for dates)
- notEquals: String inequality (also works for dates)
- contains: String contains
- notContains: String does not contain
- greaterThan: Numeric greater than (also works for dates)
- lessThan: Numeric less than (also works for dates)
- greaterThanOrEqual: Numeric >= (also works for dates)
- lessThanOrEqual: Numeric <= (also works for dates)
- before: Date-specific operator - target date is before compare date
- after: Date-specific operator - target date is after compare date
- on: Date-specific operator - target date is on the same day as compare date
- daysAgo: Dynamic operator - target date is N days before current date (value = number of days)
- daysFromNow: Dynamic operator - target date is N days after current date (value = number of days)
- monthsAgo: Dynamic operator - target date is N months before current date (value = number of months)
- monthsFromNow: Dynamic operator - target date is N months after current date (value = number of months)
- yearsAgo: Dynamic operator - target date is N years before current date (value = number of years)
- yearsFromNow: Dynamic operator - target date is N years after current date (value = number of years)
- isPast: Dynamic operator - target date is in the past (no value needed)
- isFuture: Dynamic operator - target date is in the future (no value needed)
- isToday: Dynamic operator - target date is today (no value needed)
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
- text: Single-line text input (supports placeholder, regex validation, hint tooltip)
- numeric: Number input (supports hint tooltip)
- choice: Single selection dropdown (supports hint tooltip)
- boolean: Checkbox (true/false) (supports hint tooltip)
- date: Date picker (supports hint tooltip)
- display: Read-only display field (uses vars via 'key' property or static 'value', supports hint tooltip)
- toggleList: Multiple selection checkboxes (semicolon-separated values, supports hint tooltip)
- title: Section header/title (styled paragraph)
- paragraph: Display paragraph text (supports line breaks and longer content)
- markdown: Display markdown content (supports headers, lists, links, formatting, etc.)

HINT TOOLTIP SUPPORT:
--------------------
All interactive question types support an optional 'hint' property that displays a help tooltip:
{
  "id": 1,
  "title": "Email Address",
  "type": "text",
  "value": "",
  "hint": "Enter your email address for account verification and notifications"
}

The tooltip appears when hovering over or focusing the question mark icon next to the field title.

TEXT INPUT REGEX VALIDATION:
----------------------------
Text inputs support real-time regex validation using the 'regex' property:

{
  "id": 1,
  "title": "Email Address",
  "type": "text",
  "value": "",
  "placeholder": "Enter your email",
  "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
}

Common regex patterns:
- Email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
- Phone (US): "^\\\\([0-9]{3}\\\\) [0-9]{3}-[0-9]{4}$"
- Postal Code (US): "^[0-9]{5}(-[0-9]{4})?$"
- SSN: "^[0-9]{3}-[0-9]{2}-[0-9]{4}$"
- Credit Card: "^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$"
- Alphanumeric only: "^[a-zA-Z0-9]+$"
- Letters only: "^[a-zA-Z]+$"
- Numbers only: "^[0-9]+$"

DISPLAY TYPE USAGE:
-------------------
Display fields can show global variables using the 'key' property:

{
  "id": 13,
  "title": "Customer Name",
  "type": "display",
  "key": "customer_name"
}

This will display the value of vars.customer_name. If no 'key' is provided, it uses the 'value' property:

{
  "id": 14,
  "title": "Static Text",
  "type": "display",
  "value": "This is static text"
}

EXAMPLE TEMPLATE WITH VISIBILITY:
---------------------------------
[
  {
    "id": 0,
    "title": "Personal Information",
    "type": "form",
    "visibleWhen": true,  // Always visible
    "questions": [
      {
        "id": 0,
        "title": "Name",
        "type": "text",
        "value": "",
        "regex": "^[a-zA-Z\\s]+$"
      },
      {
        "id": 0.1,
        "title": "Email Address",
        "type": "text",
        "value": "",
        "placeholder": "Enter your email",
        "regex": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        "hint": "Enter your email address for account verification and notifications"
      },
      {
        "id": 0.2,
        "title": "Phone Number",
        "type": "text",
        "value": "",
        "placeholder": "(555) 123-4567",
        "regex": "^\\\\([0-9]{3}\\\\) [0-9]{3}-[0-9]{4}$"
      },
      {"id": 1, "title": "Age", "type": "numeric", "value": 0},
      {
        "id": 2, 
        "title": "Employment Status", 
        "type": "choice", 
        "value": "",
        "choices": ["employed", "student", "unemployed"],
        "hint": "Select your current employment status to show relevant follow-up questions"
      },
      {
        "id": 3,
        "title": "Skills",
        "type": "toggleList",
        "value": "",
        "choices": ["JavaScript", "Python", "React", "Node.js", "SQL"],
        "hint": "Select all programming languages and technologies you have experience with"
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
      },
      {
        "id": 11,
        "title": "Birth Date",
        "type": "date",
        "value": ""
      },
      {
        "id": 12,
        "title": "Age Verification",
        "type": "boolean",
        "value": "false",
        "visibleWhen": {
          "path": "11",
          "op": "before",
          "value": "2005-01-01"
        }
      },
      {
        "id": 13,
        "title": "Last Login Date",
        "type": "date",
        "value": "2024-01-01"
      },
      {
        "id": 14,
        "title": "Account Inactive Warning",
        "type": "boolean",
        "value": "false",
        "visibleWhen": {
          "path": "13",
          "op": "monthsAgo",
          "value": "6"
        }
      },
      {
        "id": 15,
        "title": "Upcoming Event",
        "type": "boolean",
        "value": "false",
        "visibleWhen": {
          "path": "13",
          "op": "daysFromNow",
          "value": "30"
        }
      },
      {
        "id": 16,
        "title": "Past Event Notice",
        "type": "boolean",
        "value": "false",
        "visibleWhen": {
          "path": "13",
          "op": "isPast"
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
    
    // Helper function to check if a value looks like a date
    const isDateValue = (val) => {
        if (!val) return false;
        const str = String(val);
        // Check for common date formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, etc.
        return /^\d{4}-\d{2}-\d{2}$/.test(str) || // YYYY-MM-DD
               /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str) || // MM/DD/YYYY or DD/MM/YYYY
               /^\d{1,2}-\d{1,2}-\d{4}$/.test(str); // MM-DD-YYYY or DD-MM-YYYY
    };

    // Helper function to convert date string to Date object
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const str = String(dateStr);
        
        // Handle YYYY-MM-DD format (ISO date)
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            return new Date(str);
        }
        
        // Handle MM/DD/YYYY or DD/MM/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
            const parts = str.split('/');
            // Assume MM/DD/YYYY format (US format)
            return new Date(parts[2], parts[0] - 1, parts[1]);
        }
        
        // Handle MM-DD-YYYY or DD-MM-YYYY format
        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(str)) {
            const parts = str.split('-');
            // Assume MM-DD-YYYY format (US format)
            return new Date(parts[2], parts[0] - 1, parts[1]);
        }
        
        // Try parsing as-is
        const parsed = new Date(str);
        return isNaN(parsed.getTime()) ? null : parsed;
    };

    // Check if both values are dates for date-specific comparisons
    const isDateComparison = isDateValue(targetValue) && isDateValue(value);
    
    // Handle different operators
    switch (op) {
        case 'equals':
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() === compareDate.getTime();
            }
            return String(targetValue) === String(value);
        case 'notEquals':
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return !targetDate || !compareDate || targetDate.getTime() !== compareDate.getTime();
            }
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
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() > compareDate.getTime();
            }
            return Number(targetValue) > Number(value);
        case 'lessThan':
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() < compareDate.getTime();
            }
            return Number(targetValue) < Number(value);
        case 'greaterThanOrEqual':
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() >= compareDate.getTime();
            }
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
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() <= compareDate.getTime();
            }
            return Number(targetValue) <= Number(value);
        case 'before':
            // Date-specific operator: target date is before compare date
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() < compareDate.getTime();
            }
            return false;
        case 'after':
            // Date-specific operator: target date is after compare date
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && targetDate.getTime() > compareDate.getTime();
            }
            return false;
        case 'on':
            // Date-specific operator: target date is on the same day as compare date
            if (isDateComparison) {
                const targetDate = parseDate(targetValue);
                const compareDate = parseDate(value);
                return targetDate && compareDate && 
                       targetDate.getFullYear() === compareDate.getFullYear() &&
                       targetDate.getMonth() === compareDate.getMonth() &&
                       targetDate.getDate() === compareDate.getDate();
            }
            return false;
        case 'daysAgo':
            // Dynamic operator: target date is N days before current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const daysDiff = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
                return targetDate && daysDiff >= Number(value);
            }
            return false;
        case 'daysFromNow':
            // Dynamic operator: target date is N days after current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const daysDiff = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return targetDate && daysDiff >= Number(value);
            }
            return false;
        case 'monthsAgo':
            // Dynamic operator: target date is N months before current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const monthsDiff = (now.getFullYear() - targetDate.getFullYear()) * 12 + (now.getMonth() - targetDate.getMonth());
                return targetDate && monthsDiff >= Number(value);
            }
            return false;
        case 'monthsFromNow':
            // Dynamic operator: target date is N months after current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
                return targetDate && monthsDiff >= Number(value);
            }
            return false;
        case 'yearsAgo':
            // Dynamic operator: target date is N years before current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const yearsDiff = now.getFullYear() - targetDate.getFullYear();
                return targetDate && yearsDiff >= Number(value);
            }
            return false;
        case 'yearsFromNow':
            // Dynamic operator: target date is N years after current date
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                const yearsDiff = targetDate.getFullYear() - now.getFullYear();
                return targetDate && yearsDiff >= Number(value);
            }
            return false;
        case 'isPast':
            // Dynamic operator: target date is in the past
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                return targetDate && targetDate.getTime() < now.getTime();
            }
            return false;
        case 'isFuture':
            // Dynamic operator: target date is in the future
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                return targetDate && targetDate.getTime() > now.getTime();
            }
            return false;
        case 'isToday':
            // Dynamic operator: target date is today
            if (isDateValue(targetValue)) {
                const targetDate = parseDate(targetValue);
                const now = new Date();
                return targetDate && 
                       targetDate.getFullYear() === now.getFullYear() &&
                       targetDate.getMonth() === now.getMonth() &&
                       targetDate.getDate() === now.getDate();
            }
            return false;
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
    // State to track validation errors for each question
    const [validationErrors, setValidationErrors] = useState({});

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

    // Helper function to validate regex patterns
    const validateRegex = (value, regexPattern) => {
        if (!regexPattern || !value) return true; // No regex or empty value is valid
        try {
            const regex = new RegExp(regexPattern);
            return regex.test(value);
        } catch (error) {
            console.warn('Invalid regex pattern:', regexPattern, error);
            return true; // If regex is invalid, don't block the user
        }
    };

    // Helper function to update validation errors
    const updateValidationError = (questionId, isValid) => {
        setValidationErrors(prev => {
            if (isValid) {
                const { [questionId]: removed, ...rest } = prev;
                return rest;
            } else {
                return { ...prev, [questionId]: true };
            }
        });
    };

    // Helper function to render label with optional tooltip
    const renderLabel = (question) => {
        return (
            <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                {question.title}
                {question.hint && (
                    <V_Tooltip hint={question.hint} position="top" />
                )}
            </label>
        );
    };

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
                        const displayValue = question.key ? vars[question.key] : question.value;
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                {renderLabel(question)}
                                <p className="text-sm text-gray-500">{displayValue || ''}</p>
                            </div>
                        );
                    } else if (question.type === 'numeric') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                {renderLabel(question)}
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
                        const hasError = validationErrors[question.id];
                        const isValid = !question.regex || validateRegex(question.value, question.regex);
                        
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                {renderLabel(question)}
                                <input
                                    type="text"
                                    value={question.value}
                                    placeholder={question.placeholder || ''}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        const updatedForm = {
                                            ...Form,
                                            questions: Form.questions.map((q, qIndex) =>
                                                qIndex === index ? { ...q, value: newValue } : q
                                            )
                                        };
                                        SetForm(updatedForm);
                                        
                                        // Validate regex in real-time
                                        if (question.regex) {
                                            const isValid = validateRegex(newValue, question.regex);
                                            updateValidationError(question.id, isValid);
                                        }
                                    }}
                                    className={`bg-transparent border-0 border-b-2 outline-none px-0 py-1 text-base ${
                                        hasError 
                                            ? 'border-red-500 focus:border-red-600' 
                                            : 'border-gray-300 focus:border-blue-500'
                                    }`}
                                    style={{ borderRadius: 0 }}
                                />
                                {hasError && question.regex && (
                                    <p className="mt-1 text-xs text-red-600">
                                        Invalid format. Please check your input.
                                    </p>
                                )}
                            </div>
                        )
                    } else if (question.type === 'choice') {
                        return (
                            <div key={question.id || index} className='flex flex-col w-full max-w-[400px] pl-8'>
                                {renderLabel(question)}
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
                                <div className="flex items-center">
                                    <label className="mb-1 text-sm font-medium text-gray-700">{question.title}</label>
                                    {question.hint && (
                                        <V_Tooltip hint={question.hint} position="top" />
                                    )}
                                </div>
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
                                {renderLabel(question)}
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
                                {renderLabel(question)}
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

    // Create a mapping of visible forms and their original indices
    const visibleForms = useMemo(() => {
        return safeTemplate.map((form, originalIndex) => ({
            form,
            originalIndex,
            isVisible: evaluateVisibilityConditions(form.visibleWhen, safeTemplate, template.vars)
        })).filter(item => item.isVisible);
    }, [safeTemplate, template.vars, forceUpdate]);

    // Reset pageIndex if it's out of bounds for visible forms
    useEffect(() => {
        if (pageIndex >= visibleForms.length && visibleForms.length > 0) {
            setPageIndex(visibleForms.length - 1);
        } else if (pageIndex < 0 && visibleForms.length > 0) {
            setPageIndex(0);
        }
    }, [visibleForms.length, pageIndex]);

    // Get the current visible form
    const currentVisibleForm = visibleForms[pageIndex];
    const currentFormIndex = currentVisibleForm ? currentVisibleForm.originalIndex : -1;
    
    // Show loading state if template is not properly initialized
    if (!template || !template.answers || template.answers.length === 0) {
        return (
            <div className='flex flex-col w-full items-center justify-center p-8'>
                <div className='text-gray-500'>Loading form...</div>
            </div>
        );
    }

    // Show message if no forms are visible
    if (visibleForms.length === 0) {
        return (
            <div className='flex flex-col w-full items-center justify-center p-8'>
                <div className='text-gray-500'>No forms are currently visible based on the conditions.</div>
            </div>
        );
    }

    return (
        <div className='flex flex-col w-full'>
            {currentVisibleForm && (
                <GenerateForm
                    key={currentVisibleForm.form.id || currentFormIndex}
                    Form={currentVisibleForm.form}
                    vars={template.vars}
                    SetForm={(updatedForm) => {
                        // Always create a new array and new form object to ensure React state updates
                        const updatedTemplate = {
                            ...template,
                            answers: safeTemplate.map((f, i) =>
                                i === currentFormIndex ? { ...updatedForm } : f
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
            )}
            <div className='flex flex-col w-full items-center justify-center mt-6'>
                <div className='w-full h-2 bg-gray-200 rounded-full mb-4'>
                    <div className='h-full bg-black rounded-full' style={{width: `${(pageIndex / visibleForms.length) * 100}%`}}></div>
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
                        disabled={pageIndex === visibleForms.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

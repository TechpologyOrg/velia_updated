import React, {useEffect, useState} from 'react'
import V_Input from '../components/V_Input';

/* 
[
    {
      "id": 0,
      "title": "Identitet & kontaktuppgifter",
      "type": "form",
      "questions":
      [
        {"id": 0,"title": "Namn", "type": "display", "key": "customer_full_name"},
        {"id": 1,"title": "Personnummer", "type": "display", "key": "customer_personnummer"},
        {"id": 2,"title": "Address", "type": "text", "value": ""},
        {"id": 3,"title": "Email", "type": "text", "value": ""},
        {"id": 4,"title": "Telefon", "type": "text", "value": ""},
        {"id": 5,"title": "Ägarandel", "type": "numeric", "value": 0}
      ]
    },
    {
      "id": 1,
      "title": "Sysselsättning",
      "type": "form",
      "questions":
      [
        {"id": 0,"title": "Heltidsanställd", "type": "text", "value": ""},
        {"id": 1,"title": "Deltidsanställd", "type": "text", "value": ""},
        {"id": 2,"title": "Egenföretagare", "type": "text", "value": ""},
        {"id": 3,"title": "Student", "type": "text", "value": ""},
        {"id": 4,"title": "Pensionär", "type": "text", "value": ""},
        {"id": 5,"title": "Sjuk-/aktivitetsersättning", "type": "text", "value": ""},
        {"id": 6,"title": "Arbetssökande", "type": "text", "value": ""},
        {"id": 7,"title": "Annat", "type": "text", "value": ""}
      ]
    } 
  ]
 */

export function GenerateForm({ Form, SetForm, template }) {
    // Compute visibility without causing re-renders
    let visible = false;

    if (
        Form.visibleWhen &&
        Object.prototype.hasOwnProperty.call(Form.visibleWhen, 'anyOf')
    ) {
        for (let i = 0; i < Form.visibleWhen.anyOf.length; i++) {
            const cond = Form.visibleWhen.anyOf[i];
            const [formIndex, questionIndex] = cond.path.split('.').map(Number);
            const question =
                template &&
                template[formIndex] &&
                template[formIndex].questions &&
                template[formIndex].questions[questionIndex];

            if (!question) continue;

            if (cond.op === 'equals') {
                if (
                    (typeof question.value === 'boolean'
                        ? String(question.value)
                        : question.value) === cond.value
                ) {
                    visible = true;
                    break;
                }
            }
            if (cond.op === 'notEquals') {
                if (
                    (typeof question.value === 'boolean'
                        ? String(question.value)
                        : question.value) !== cond.value
                ) {
                    visible = true;
                    break;
                }
            }
        }
    }else{
        visible = true;
    }

    // Add safety check for Form.questions
    if (!Form || !Form.questions || !Array.isArray(Form.questions)) {
        console.error('GenerateForm: Invalid Form or questions data:', Form);
        return <div>Error: Invalid form data</div>;
    }

    if (!visible) {
        return null;
    }

    return (
        <div className='flex flex-col w-full p-4 overflow-y-scroll'>
            <p className='text-xl font-bold'>{Form.title}</p>
            <p className='text-sm text-neutral-500 mb-4'>{Form.description}</p>

            <div className='flex flex-col w-full gap-4'>
                {Form.questions.map((question, index) => {
                    if (question.type === 'display') {
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
                                        Form["questions"][index]["value"] = e.target.value;
                                        SetForm({ ...Form });
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
                                        Form["questions"][index]["value"] = e.target.value;
                                        SetForm(Form);
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
                                        Form["questions"][index]["value"] = e.target.value;
                                        SetForm(Form);
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
                                        Form["questions"][index]["value"] = e.target.checked;
                                        SetForm(Form);
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
                                        Form["questions"][index]["value"] = e.target.value;
                                        SetForm(Form);
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

export function GenerateTemplate({ template, SetTemplate }) {
    // Defensive copy to avoid mutating the original template
    const safeTemplate = Array.isArray(template) ? template : [];

    return (
        <div className='flex flex-col w-full h-full'>
            {safeTemplate.map((form, index) => (
                <GenerateForm
                    key={form.id || index}
                    Form={form}
                    SetForm={(updatedForm) => {
                        // Always create a new array and new form object to ensure React state updates
                        const updatedTemplate = safeTemplate.map((f, i) =>
                            i === index ? { ...updatedForm } : f
                        );
                        SetTemplate(updatedTemplate);
                    }}
                    template={safeTemplate}
                />
            ))}
        </div>
    );
}

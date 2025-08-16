import React, { useState, useEffect, useRef } from 'react'
import { GenerateTemplate } from '../../controllers/TemplateController';

export default function ViewForm() {
    const [template, setTemplate] = useState(
        [
            {
                "id": 0,
                "title": "Identitet & kontaktuppgifter",
                "type": "form",
                "questions":
                    [
                        { "id": 0, "title": "Namn", "type": "display", "key": "customer_full_name" },
                        { "id": 1, "title": "Personnummer", "type": "display", "key": "customer_personnummer" },
                        { "id": 2, "title": "Address", "type": "text", "value": "" },
                        { "id": 3, "title": "Email", "type": "text", "value": "" },
                        { "id": 4, "title": "Telefon", "type": "text", "value": "" },
                        { "id": 5, "title": "Ägarandel", "type": "numeric", "value": 0 }
                    ]
            },
            {
                "id": 1,
                "title": "Sysselsättning",
                "type": "form",
                "questions":
                    [
                        {
                            "id": 0, "title": "Vad har du för huvudsaklig sysselsättning?", "type": "choice", "choices": [
                                "Heltidsanställd", "Deltidsanställd", "Egenföretagare", "Student", "Pensionär", "Sjuk-/aktivitetsersättning", "Arbetssökande", "Annat"
                            ], "value": ""
                        }
                    ]
            },
            {
                "id": 2,
                "title": "Bostad",
                "type": "form",
                "questions":
                    [
                        { "id": 0, "title": "Address", "type": "text", "value": "" },
                        { "id": 1, "title": "Postnummer", "type": "text", "value": "" },
                        { "id": 2, "title": "Ort", "type": "text", "value": "" },
                        { "id": 3, "title": "Kommun", "type": "text", "value": "" },
                        {
                            "id": 4, "title": "Typ av bostad", "type": "choice", "choices": [
                                "Bostadsrätt", "Villa", "Fritidshus", "Tomt", "Ägarlägenhet", "Annat"
                            ], "value": ""
                        }
                    ]
            },
            {
                "id": 3,
                "title": "Uppdragets syte och art",
                "type": "form",
                "questions":
                    [
                        { "id": 0, "title": "Uppdragstyp", "type": "choice", "choices": ["Förmedlingsuppdrag", "Skrivuppdrag", "Värderingsuppdrag"], "value": "" },
                        {
                            "id": 1, "title": "Skäl till försäljning", "type": "choice", "choices": [
                                "Flytt", "Separation", "Arv", "Ekonomiska Skäl", "Annat"
                            ], "value": ""
                        }
                    ]
            },
            {
                "id": 4,
                "title": "Förvärv och finansiering",
                "type": "form",
                "questions":
                    [
                        { "id": 0, "title": "När förvärvade du bostaden?", "type": "date", "value": "" },
                        {
                            "id": 1, "title": "Hur förvärvade du bostaden?", "type": "choice", "choices": [
                                "Egna medel", "Banklån", "Privatlån", "Arv", "Gåva", "Försäljning av tidigare egendom", "Annat"
                            ], "value": ""
                        }
                    ]
            },
            {
                "id": 5,
                "title": "PEP & Högrisktredjeland",
                "type": "form",
                "questions": [
                    {
                        "id": 0, "title": "Har du någon koppling till ett högrisktredjeland (utanför EES) som identifierats av EU-kommissionen?", "type": "choice", "choices": [
                            "Nej", "Ja, jag har medborgarskap", "Ja, jag har skatterättslig hemvist", "Ja, jag har ägande i företag/verksamhet där", "Ja, jag har annan koppling"
                        ], "value": ""
                    },
                    { "id": 1, "title": "Har du, under de senaste 18 månaderna, haft ett politiskt utsatt uppdrag (PEP)?", "type": "boolean", "value": false },
                    { "id": 2, "title": "Har någon familjemedlem eller medarbetare haft ett sådant uppdrag?", "type": "boolean", "value": false }
                ]
            },
            {
                "id": 6,
                "title": "Följdfrågor vid hög risk",
                "type": "form",
                "visibleWhen": {
                    "anyOf": [
                        { "path": "5.0", "op": "notEquals", "value": "Nej" },
                        { "path": "5.1", "op": "equals", "value": "true" },
                        { "path": "5.2", "op": "equals", "value": "true" }
                    ]
                },
                "questions": [
                    { "id": 0, "title": "Har du genomfört några förbättringsåtgärder (renovering etc) under tiden du ägt bostaden?", "type": "boolean", "value": false },
                    { "id": 1, "title": "Har du gjort några större avbetalningar under innehavstiden?", "type": "boolean", "value": false }
                ]
            }
        ]
    );

    // --- REWRITE: Remove broken interval logic, use a debounced effect instead ---

    // This ref holds the last logged template string
    const lastLoggedTemplateRef = useRef(JSON.stringify(template));
    // This ref holds the timeout id for debounce
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        // If template changed, debounce log after 5 seconds of inactivity
        if (JSON.stringify(template) !== lastLoggedTemplateRef.current) {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            debounceTimeoutRef.current = setTimeout(() => {
                console.log('Template changed:', template);
                lastLoggedTemplateRef.current = JSON.stringify(template);
            }, 5000);
        }
        // Cleanup on unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [template]);

    return (
        <div className='flex flex-col w-full h-full items-start justify-center pb-12'>
            <GenerateTemplate
                template={template}
                SetTemplate={(newTemplate) => {
                    // Always update state to a new array to trigger re-render
                    setTemplate([...newTemplate]);
                }}
            />
            <button
                className='px-4 py-2 bg-black cursor-pointer text-white rounded-md w-[180px] self-center flex items-center justify-center gap-2'
                onClick={() => {
                    console.log("Current template state:", template);
                }}
            >
                Klar
            </button>
        </div>
    )
}
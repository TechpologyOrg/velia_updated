import React, { useState, useEffect } from 'react'

export default function CustomerDashboardHome() {
    const user = JSON.parse(sessionStorage.getItem('user')).user;
    const organisation = user.organisation;

    const [nyheter, setNyheter] = useState([]);

    useEffect(() => {
    }, []);

    return (
        <div className="w-full h-full flex flex-col px-2 md:px-8 ">
            <p className="text-2xl md:text-3xl font-semibold mb-2">{`Välkommen ${user.first_name} ${user.last_name}`}</p>
            <p className="text-neutral-500">Visa och hantera dina uppgifter i ett tydligt listformat.</p>

            <div className="w-full flex flex-col md:flex-row gap-6 items-stretch justify-between mt-8">
                {/* Nyhetsbrev */}
                <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200 p-7">
                    <h2 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">Nyhetsbrev</h2>
                    <div className="w-full flex-1 mt-2 pt-2 overflow-y-auto">
                        {
                            (nyheter.length > 0) ? (
                                nyheter.map((nyhet, index) => (
                                    <div
                                        key={index}
                                        className="w-full flex flex-row gap-2 items-center justify-between py-3 px-2 rounded-lg hover:bg-neutral-100 transition-colors border-b last:border-b-0 border-neutral-100"
                                    >
                                        <span className="text-base text-neutral-800 font-medium">{nyhet.title}</span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-neutral-400 text-sm">Inga nyheter</span>
                            )
                        }
                    </div>
                </div>

                {/* Support */}
                <div className="flex-1 min-w-[220px] max-w-[340px] flex flex-col bg-white rounded-xl border border-neutral-200 p-7">
                    <h2 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">Support</h2>
                    <div className="w-full flex flex-col gap-3">
                        <button
                            className="w-full h-[44px] flex items-center justify-start gap-3 px-4 bg-white border border-neutral-200 rounded-lg hover:bg-blue-50 active:bg-blue-100 transition-colors text-neutral-800 font-medium text-base focus:outline-none focus:ring-1 focus:ring-blue-100"
                            type="button">Guider</button>

                        <div className="mt-4 mb-2 text-xs text-neutral-500 font-medium tracking-wide">Kontakta support</div>
                        <button
                            className="w-full h-[44px] flex items-center justify-center gap-3 px-4 bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-400 active:bg-blue-600 transition-colors text-white font-semibold text-base focus:outline-none focus:ring-1 focus:ring-blue-200"
                            type="button">Öppna ärende</button>
                    </div>
                </div>
            </div>

            {/* Att göra */}
            <div className="w-full flex flex-col mt-10 bg-white rounded-xl border border-neutral-200 p-7">
                <h2 className="text-xl font-bold text-neutral-900 mb-3 tracking-tight">Att göra</h2>
                <div className="w-full flex-1 mt-2 pt-2 overflow-y-auto flex items-center justify-center min-h-[120px]">
                    <span className="text-neutral-400 text-sm">Inga uppgifter för tillfället</span>
                </div>
            </div>
        </div>
    )
}
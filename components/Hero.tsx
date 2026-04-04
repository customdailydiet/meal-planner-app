export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-16 sm:pt-24 lg:pt-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Put your diet on </span>
                                <span className="block text-emerald-500 xl:inline">autopilot</span>
                            </h1>
                            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Generate personalized meal plans based on your goals, diet preferences, and calories in seconds. Let CustomDailyDiet take the guesswork out of nutrition.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="#generator"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 md:py-4 md:text-lg md:px-10 transition-colors"
                                    >
                                        Get Started
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50 flex items-center justify-center border-l border-slate-100">
                <div className="px-4 py-16 sm:px-6 lg:px-8 h-full flex flex-col justify-center w-full max-w-xl">
                    {/* Optional illustration placeholder */}
                    <div className="w-full aspect-[4/3] bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100/50">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-white rounded-full mx-auto shadow-sm flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-emerald-800">Smart Meal Plans</h3>
                            <p className="text-sm text-emerald-600/80 mt-1">Generated instantly, just for you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

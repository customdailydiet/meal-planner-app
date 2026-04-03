import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-400">
                            MealAI
                        </Link>
                    </div>
                    <div className="hidden md:flex space-x-8 items-center">
                        <a href="#diets" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium">
                            Supported Diets
                        </a>
                        <a href="#calculators" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium">
                            Pricing
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/auth" className="text-slate-600 hover:text-emerald-500 transition-colors font-medium">
                            Sign In
                        </Link>
                        <Link
                            href="/auth"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

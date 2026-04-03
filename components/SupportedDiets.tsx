import { Flame, Leaf, Drumstick, Wheat, Sparkles } from "lucide-react";

const diets = [
    {
        name: 'Keto',
        description: 'Low-carb, high-fat diet.',
        icon: Flame,
        styles: { wrapper: 'bg-blue-50 text-blue-500 group-hover:bg-blue-500' }
    },
    {
        name: 'Vegan',
        description: '100% plant-based diet.',
        icon: Leaf,
        styles: { wrapper: 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500' }
    },
    {
        name: 'Paleo',
        description: 'Whole foods like our ancestors.',
        icon: Drumstick,
        styles: { wrapper: 'bg-orange-50 text-orange-500 group-hover:bg-orange-500' }
    },
    {
        name: 'Mediterranean',
        description: 'Healthy fats, fish, and greens.',
        icon: Wheat,
        styles: { wrapper: 'bg-teal-50 text-teal-500 group-hover:bg-teal-500' }
    },
    {
        name: 'Vegetarian',
        description: 'No meat, just plants and dairy.',
        icon: Leaf,
        styles: { wrapper: 'bg-lime-50 text-lime-500 group-hover:bg-lime-500' }
    },
    {
        name: 'Anything',
        description: 'No restrictions, eat it all.',
        icon: Sparkles,
        styles: { wrapper: 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-500' }
    },
];

export default function SupportedDiets() {
    return (
        <section id="diets" className="py-20 bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Supported Diets
                    </h2>
                    <p className="mt-4 text-xl text-slate-500">
                        We support a wide variety of diets to match your goals and lifestyle perfectly.
                    </p>
                </div>
                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {diets.map((diet) => {
                        const IconComponent = diet.icon;
                        return (
                            <div
                                key={diet.name}
                                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-500/50 p-8 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${diet.styles.wrapper}`}>
                                    <IconComponent className="w-7 h-7 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{diet.name}</h3>
                                <p className="text-slate-600 leading-relaxed">{diet.description}</p>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

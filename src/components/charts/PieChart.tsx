import React, { useState, useEffect } from 'react';

interface PieChartProps {
    data: { label: string; value: number }[];
    currency?: string;
}

const COLORS = ["#8B5CF6", "#EC4899", "#F97316", "#10B981", "#3B82F6", "#F59E0B"];

const PieChart: React.FC<PieChartProps> = ({ data, currency = '' }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    if (data.length === 0) {
        return <div className="text-center py-10 text-sm text-gray-500">No spending data for this period.</div>;
    }

    let cumulativePercent = 0;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-8">
                {/* SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full drop-shadow-2xl">
                    {data.map((item, index) => {
                        const percent = (item.value / total) * 100;
                        const gap = percent === 100 ? 0 : 4; 
                        const dashArray = `${Math.max(percent - gap, 0)} ${100 - Math.max(percent - gap, 0)}`;
                        const dashOffset = -cumulativePercent;
                        cumulativePercent += percent;
                        const isActive = activeIndex === index;
                        const color = COLORS[index % COLORS.length];

                        return (
                            <circle
                                key={item.label}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                stroke={color}
                                strokeWidth={isActive ? "12" : "8"}
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                className={`transition-all duration-500 ease-out cursor-pointer hover:opacity-100 ${mounted ? 'opacity-90' : 'opacity-0'}`}
                                style={{ 
                                    transitionDelay: `${index * 100}ms`,
                                    filter: isActive ? `drop-shadow(0 0 8px ${color})` : 'none'
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            />
                        );
                    })}
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {activeIndex !== null ? data[activeIndex].label : 'Total Spent'}
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white transition-all duration-300">
                        {currency}
                        {activeIndex !== null 
                            ? data[activeIndex].value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) 
                            : total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                </div>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-3 w-full px-2">
                {data.map((item, index) => (
                    <div 
                        key={item.label} 
                        className={`flex items-center justify-between text-sm p-2.5 rounded-xl transition-all duration-200 cursor-default ${activeIndex === index ? 'bg-gray-100 dark:bg-white/10 scale-105 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs">{item.label}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-xs">
                            {Math.round((item.value / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;

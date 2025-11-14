import React, { useState } from 'react';

interface PieChartProps {
    data: { label: string; value: number }[];
    currency?: string;
}

const COLORS = ["#8B5CF6", "#EC4899", "#F97316", "#10B981", "#3B82F6", "#F59E0B"];

const PieChart: React.FC<PieChartProps> = ({ data, currency = '' }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (data.length === 0) {
        return <div className="text-center py-10 text-sm text-gray-500">No spending data for this period.</div>;
    }

    let cumulativePercent = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percent = (item.value / total) * 100;
                        const dashArray = `${percent} ${100 - percent}`;
                        const dashOffset = -cumulativePercent;
                        cumulativePercent += percent;
                        const isActive = activeIndex === index;

                        return (
                            <circle
                                key={item.label}
                                cx="50"
                                cy="50"
                                r="45"
                                fill="transparent"
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={isActive ? "12" : "10"}
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-300"
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            />
                        );
                    })}
                </svg>
                 {activeIndex !== null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-xs text-gray-500 dark:text-neutral-400">{data[activeIndex].label}</span>
                        <span className="font-bold text-xl text-gray-900 dark:text-white">{currency}{data[activeIndex].value.toFixed(2)}</span>
                    </div>
                 )}
            </div>
            <div className="w-full sm:w-auto">
                <ul className="space-y-2 text-sm">
                    {data.map((item, index) => (
                        <li 
                            key={item.label} 
                            className="flex items-center justify-between"
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span className="text-gray-600 dark:text-neutral-300">{item.label}</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">{((item.value / total) * 100).toFixed(0)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PieChart;
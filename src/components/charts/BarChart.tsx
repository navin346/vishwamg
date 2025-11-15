import React, { useState } from 'react';

interface BarChartProps {
    data: { label: string; value: number }[];
    currency?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, currency = '' }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);

    if (data.length === 0) {
        return <div className="text-center py-10 text-sm text-gray-500">No spending data for this period.</div>;
    }
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 150;
    const barWidth = 20;
    const barMargin = 15;
    const width = data.length * (barWidth + barMargin);

    const handleMouseEnter = (d: { label: string; value: number }, i: number, barHeight: number) => {
        const x = i * (barWidth + barMargin) + barWidth / 2;
        const y = chartHeight - barHeight - 10; // Position tooltip above the bar
        setTooltip({ x, y, value: `${currency}${d.value.toFixed(2)}` });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <div className="w-full overflow-x-auto relative">
            <svg width={width} height={chartHeight + 20} className="font-sans">
                {data.map((d, i) => {
                    const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
                    const x = i * (barWidth + barMargin);
                    const y = chartHeight - barHeight;

                    return (
                        <g key={i} onMouseEnter={() => handleMouseEnter(d, i, barHeight)} onMouseLeave={handleMouseLeave}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill="url(#barGradient)"
                                rx="4"
                                className="transition-all duration-300 origin-bottom hover:opacity-80"
                            >
                                <animate attributeName="height" from="0" to={barHeight} dur="0.5s" fill="freeze" />
                                <animate attributeName="y" from={chartHeight} to={y} dur="0.5s" fill="freeze" />
                            </rect>
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight + 15}
                                textAnchor="middle"
                                fontSize="10"
                                className="fill-current text-gray-500 dark:text-neutral-400"
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}
                 <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                </defs>
            </svg>
             {tooltip && (
                <div 
                    className="absolute bg-gray-800 dark:bg-black text-white text-xs rounded py-1 px-2 pointer-events-none transition-opacity duration-200"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
                >
                    {tooltip.value}
                </div>
            )}
        </div>
    );
};

export default BarChart;
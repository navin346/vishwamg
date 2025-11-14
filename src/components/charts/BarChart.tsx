import React from 'react';

interface BarChartProps {
    data: { label: string; value: number }[];
    currency?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, currency = '' }) => {
    if (data.length === 0) {
        return <div className="text-center py-10 text-sm text-gray-500">No spending data for this period.</div>;
    }
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 150;
    const barWidth = 20;
    const barMargin = 15;
    const width = data.length * (barWidth + barMargin);

    return (
        <div className="w-full overflow-x-auto">
            <svg width={width} height={chartHeight + 20} className="font-sans">
                {data.map((d, i) => {
                    const barHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight : 0;
                    const x = i * (barWidth + barMargin);
                    const y = chartHeight - barHeight;

                    return (
                        <g key={i}>
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
        </div>
    );
};

export default BarChart;
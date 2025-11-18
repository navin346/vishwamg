import React, { useState, useEffect } from 'react';

interface BarChartProps {
    data: { label: string; value: number }[];
    currency?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, currency = '' }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (data.length === 0) {
        return <div className="text-center py-10 text-sm text-gray-500">No spending data for this period.</div>;
    }

    const maxValue = Math.max(...data.map(d => d.value), 0);
    const chartHeight = 180;
    const barWidth = 14;
    const gap = 28;
    const width = data.length * (barWidth + gap);

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="relative" style={{ width: `${width}px`, minWidth: '100%' }}>
                <svg width="100%" height={chartHeight + 40} viewBox={`0 0 ${width} ${chartHeight + 40}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#6366F1" />
                        </linearGradient>
                        <linearGradient id="barHighlight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A78BFA" />
                            <stop offset="100%" stopColor="#818CF8" />
                        </linearGradient>
                    </defs>

                    {/* Dashed Grid Lines */}
                    <line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke="currentColor" className="text-gray-200 dark:text-white/10" strokeWidth="1" />
                    <line x1="0" y1={chartHeight * 0.66} x2="100%" y2={chartHeight * 0.66} stroke="currentColor" className="text-gray-100 dark:text-white/5" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="0" y1={chartHeight * 0.33} x2="100%" y2={chartHeight * 0.33} stroke="currentColor" className="text-gray-100 dark:text-white/5" strokeDasharray="4 4" strokeWidth="1" />

                    {data.map((d, i) => {
                        // Calculate height, defaulting to a minimal 4px to show a blip if value is 0 but entry exists
                        const rawHeight = maxValue > 0 ? (d.value / maxValue) * chartHeight * 0.85 : 0;
                        const barHeight = Math.max(rawHeight, 4); 
                        const x = i * (barWidth + gap) + gap / 2;
                        const y = chartHeight - barHeight;

                        return (
                            <g 
                                key={i} 
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, value: `${currency}${d.value.toFixed(2)}` });
                                }}
                                onMouseLeave={() => setTooltip(null)}
                                className="group cursor-pointer"
                            >
                                {/* Invisible Hit Area */}
                                <rect x={x - gap/2} y="0" width={barWidth + gap} height={chartHeight} fill="transparent" />
                                
                                {/* The Bar */}
                                <rect
                                    x={x}
                                    y={mounted ? y : chartHeight}
                                    width={barWidth}
                                    height={mounted ? barHeight : 0}
                                    fill="url(#barGradient)"
                                    rx={barWidth / 2}
                                    className="transition-all duration-[800ms] ease-spring group-hover:fill-[url(#barHighlight)]"
                                    style={{ transitionDelay: `${i * 70}ms` }}
                                />
                                
                                {/* Date Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 24}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fontWeight="500"
                                    className="fill-current text-gray-400 dark:text-gray-500"
                                >
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Tooltip */}
                {tooltip && (
                    <div 
                        className="fixed z-50 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-3 animate-fade-in border border-gray-700 dark:border-gray-200"
                        style={{ left: tooltip.x, top: tooltip.y }}
                    >
                        {tooltip.value}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-white border-r border-b border-gray-700 dark:border-gray-200"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarChart;

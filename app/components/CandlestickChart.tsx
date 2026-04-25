'use client';

import { ResponsiveContainer, ComposedChart, Bar, YAxis, ReferenceLine, Tooltip } from 'recharts';

interface Candle {
    open: number;
    high: number;
    low: number;
    close: number;
}

const candles: Candle[] = [
    { open: 40, high: 60, low: 30, close: 55 },
    { open: 55, high: 70, low: 48, close: 50 },
    { open: 50, high: 65, low: 40, close: 60 },
    { open: 60, high: 80, low: 55, close: 75 },
    { open: 75, high: 90, low: 65, close: 68 },
    { open: 68, high: 75, low: 50, close: 52 },
    { open: 52, high: 65, low: 45, close: 62 },
    { open: 62, high: 85, low: 58, close: 80 },
    { open: 80, high: 100, low: 72, close: 95 },
    { open: 95, high: 110, low: 85, close: 88 },
    { open: 88, high: 98, low: 70, close: 72 },
    { open: 72, high: 90, low: 65, close: 85 },
    { open: 85, high: 115, low: 80, close: 110 },
    { open: 110, high: 130, low: 100, close: 125 },
    { open: 125, high: 145, low: 115, close: 135 },
    { open: 135, high: 150, low: 120, close: 128 },
    { open: 128, high: 140, low: 110, close: 115 },
    { open: 115, high: 135, low: 108, close: 130 },
    { open: 130, high: 155, low: 125, close: 148 },
    { open: 148, high: 168, low: 138, close: 160 },
];

const transformedData = candles.map((c, index) => ({
    ...c,
    body: [Math.min(c.open, c.close), Math.max(c.open, c.close)],
    index,
}));

const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;

    // Mathematically derive scaling ratio from the body representation
    let bodyMin = Math.min(open, close);
    let bodyMax = Math.max(open, close);
    if (bodyMax === bodyMin) {
        bodyMax += 0.01;
        bodyMin -= 0.01;
    }
    const ratio = height / (bodyMax - bodyMin);

    // Calculate absolute Y coordinates for the wicks
    const yHigh = y - (high - bodyMax) * ratio;
    const yLow = (y + height) + (bodyMin - low) * ratio;

    const isUp = close >= open;
    const color = isUp ? '#38bdf8' : '#fb7185';

    // Center the wick in the middle of the available width
    const cx = x + width / 2;
    // Shrink the bar width slightly so they don't touch
    const barWidth = width * 0.75;
    const barX = cx - barWidth / 2;

    return (
        <g stroke={color}>
            {/* Wick */}
            <line x1={cx} y1={yHigh} x2={cx} y2={yLow} strokeWidth={1.5} />
            {/* Body */}
            <rect
                x={barX}
                y={y}
                width={barWidth}
                height={Math.max(height, 1.5)}
                fill={color}
                rx={1.5}
                stroke="none"
            />
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#141428]/95 border border-white/10 rounded-lg p-3 text-xs shadow-2xl backdrop-blur-md">
                <div className="flex justify-between gap-6 mb-1.5">
                    <span className="text-[#888888]">Open</span>
                    <span className="text-white font-medium">{data.open}</span>
                </div>
                <div className="flex justify-between gap-6 mb-1.5">
                    <span className="text-[#888888]">High</span>
                    <span className="text-white font-medium">{data.high}</span>
                </div>
                <div className="flex justify-between gap-6 mb-1.5">
                    <span className="text-[#888888]">Low</span>
                    <span className="text-white font-medium">{data.low}</span>
                </div>
                <div className="flex justify-between gap-6">
                    <span className="text-[#888888]">Close</span>
                    <span className="text-white font-medium">{data.close}</span>
                </div>
            </div>
        );
    }
    return null;
};

const ReferenceLabel = (props: any) => {
    const { viewBox } = props;
    const { x, y, width } = viewBox;
    const rightX = x + width;

    return (
        <g>
            <rect
                x={rightX + 5}
                y={y - 11}
                width={46}
                height={22}
                rx="6"
                fill="#ffffff"
            />
            <text
                x={rightX + 28}
                y={y + 3.5}
                fill="#0a0a0c"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="var(--font-poppins), sans-serif"
                letterSpacing="-0.5"
            >
                15416.12
            </text>
        </g>
    );
};

export default function CandlestickChart() {
    const allValues = candles.flatMap((c) => [c.high, c.low]);
    const minVal = Math.min(...allValues) - 8;
    const maxVal = Math.max(...allValues) + 8;

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={transformedData}
                    margin={{ top: 20, right: 55, bottom: 10, left: 0 }}
                >
                    <YAxis domain={[minVal, maxVal]} hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        isAnimationActive={false}
                    />
                    <ReferenceLine
                        y={148}
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        label={<ReferenceLabel />}
                        ifOverflow="extendDomain"
                    />
                    <Bar
                        dataKey="body"
                        shape={(props: any) => <CandlestickShape {...props} />}
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
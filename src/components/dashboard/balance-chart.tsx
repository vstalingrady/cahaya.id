
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { type Transaction } from "@/lib/data";
import { format } from 'date-fns';


type ChartDataPoint = {
    date: Date;
    netWorth: number;
    transactions: Transaction[];
};

type BalanceChartProps = {
    chartData: ChartDataPoint[];
    onPointSelect: (data: any) => void;
};

// --- SVG Path Smoothing Helpers ---
const line = (pointA: number[], pointB: number[]) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

const controlPoint = (current: number[], previous: number[] | undefined, next: number[] | undefined, reverse?: boolean) => {
  const p = previous || current
  const n = next || current

  // If we are at an endpoint (i.e. no previous or next point), the control
  // point should be the point itself to prevent the line from extending past the edge.
  if (!previous || !next) {
    return current;
  }

  const smoothing = 0.2
  const o = line(p, n)
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

const createSmoothPath = (points: number[][]) => {
  const bezierCommand = (point: number[], i: number, a: number[][]) => {
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
  }
  return points.reduce((acc, point, i, a) => i === 0
    ? `M ${point[0]},${point[1]}`
    : `${acc} ${bezierCommand(point, i, a)}`
  , '')
}
// --- End of SVG Path Helpers ---

export default function BalanceChart({ chartData: dataPoints, onPointSelect }: BalanceChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(dataPoints.length > 0 ? dataPoints.length - 1 : 0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setActiveIndex(dataPoints.length > 0 ? dataPoints.length - 1 : 0)
    setAnimationProgress(0);
    const timer = requestAnimationFrame(() => setAnimationProgress(0.02));
    return () => cancelAnimationFrame(timer);
  }, [dataPoints]);

  useEffect(() => {
    if (animationProgress > 0 && animationProgress < 1) {
      const timer = requestAnimationFrame(() => {
        setAnimationProgress(prev => Math.min(prev + 0.02, 1));
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [animationProgress]);

  useEffect(() => {
    if (dataPoints.length > 0 && activeIndex >= dataPoints.length) {
        const newIndex = dataPoints.length - 1;
        setActiveIndex(newIndex);
        onPointSelect({ point: dataPoints[newIndex], index: newIndex });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints, activeIndex]);

  if (!dataPoints || dataPoints.length < 2) {
      return (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Not enough data to display chart.
          </div>
      )
  }

  const chartWidth = 350;
  const chartHeight = 180;
  const padding = { top: 10, right: 10, bottom: 30, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const minValue = Math.min(...dataPoints.map(d => d.netWorth));
  const maxValue = Math.max(...dataPoints.map(d => d.netWorth));
  const valueRange = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const getX = (index: number) => padding.left + (index / (dataPoints.length - 1)) * innerWidth;
  const getY = (value: number) => padding.top + ((maxValue - value) / valueRange) * innerHeight;

  const pathPoints = useMemo(() => 
      dataPoints.map((p, i) => [getX(i), getY(p.netWorth)])
  , [dataPoints, getX, getY]);
  
  const pathD = createSmoothPath(pathPoints.slice(0, Math.ceil(pathPoints.length * animationProgress)));

  const createAreaPath = (points: number[][]) => {
      const linePath = createSmoothPath(points);
      if (points.length === 0) return "";
      const lastX = points[points.length-1][0];
      const firstX = points[0][0];
      return `${linePath} L ${lastX.toFixed(2)} ${chartHeight - padding.bottom} L ${firstX.toFixed(2)} ${chartHeight - padding.bottom} Z`;
  };
  const areaPathD = createAreaPath(pathPoints.slice(0, Math.ceil(pathPoints.length * animationProgress)));
  
  const formatYAxisLabel = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
    return value.toString();
  };

  const yAxisTicks = useMemo(() => {
      const ticks = [minValue, minValue + valueRange * 0.5, maxValue];
      return ticks.map(t => ({ value: t, y: getY(t) }));
  }, [minValue, valueRange, maxValue, getY]);

  const xAxisTicks = React.useMemo(() => {
      if (dataPoints.length < 2) return [];

      const ticks = [];
      const numPoints = dataPoints.length;
      const maxTicks = numPoints > 30 ? 6 : 5;
      const tickIncrement = Math.max(1, Math.ceil(numPoints / maxTicks));

      for (let i = 0; i < numPoints; i += tickIncrement) {
        const point = dataPoints[i];
        if (point) {
          ticks.push({
            value: point.date,
            x: getX(i)
          });
        }
      }
      
      const lastTickX = ticks[ticks.length - 1]?.x;
      const endX = getX(numPoints - 1);

      if (!lastTickX || endX - lastTickX > innerWidth / (maxTicks * 2)) {
          const lastPoint = dataPoints[numPoints - 1];
          ticks.push({
              value: lastPoint.date,
              x: getX(numPoints - 1)
          });
      }

      return ticks.filter((tick, index, self) =>
          index === self.findIndex((t) => format(t.value, 'yyyy-MM-dd') === format(tick.value, 'yyyy-MM-dd'))
      );
  }, [dataPoints, getX, innerWidth]);

  const formatXAxisLabel = (date: Date) => {
      const numPoints = dataPoints.length;
      if (numPoints > 90) { // For 1Y or ALL, show abbreviated month
          return format(date, 'MMM');
      }
      if (numPoints > 7) { // For 30D view
          return format(date, 'd');
      }
      return format(date, 'EEE'); // For 7D view, show day of week
  };
  
  const handleInteraction = (e: React.MouseEvent<SVGSVGElement>, isClick: boolean) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const pointIndex = Math.round(((x - padding.left) / innerWidth) * (dataPoints.length - 1));
    
    if (pointIndex >= 0 && pointIndex < dataPoints.length) {
      const point = dataPoints[pointIndex];
      const pointX = getX(pointIndex);
      
      const threshold = innerWidth / (dataPoints.length - 1) / 2;

      if (Math.abs(x - pointX) < threshold + 5) {
        if(isClick) {
            setActiveIndex(pointIndex);
            onPointSelect({ point, index: pointIndex });
        } else {
            const pointY = getY(point.netWorth);
            setHoveredPoint({ ...point, index: pointIndex, x: pointX, y: pointY });
        }
      } else if (!isClick) {
        setHoveredPoint(null);
      }
    }
  };

  const activePoint = activeIndex !== null && dataPoints[activeIndex] ? { ...dataPoints[activeIndex], index: activeIndex, x: getX(activeIndex), y: getY(dataPoints[activeIndex].netWorth) } : null;

  return (
    <div className='w-full h-full flex flex-col'>
       <div className="relative flex-grow">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full cursor-pointer"
            onClick={(e) => handleInteraction(e, true)}
            onMouseMove={(e) => handleInteraction(e, false)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>

            {/* Y-Axis Grid Lines & Labels */}
            {yAxisTicks.map((tick, index) => (
              <g key={index} className="text-[10px] fill-muted-foreground">
                <line
                  x1={padding.left}
                  y1={tick.y}
                  x2={chartWidth - padding.right}
                  y2={tick.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <text x={padding.left - 8} y={tick.y + 3} textAnchor="end">
                  {formatYAxisLabel(tick.value)}
                </text>
              </g>
            ))}

            {/* X-Axis Labels */}
            {xAxisTicks.map((tick, index) => (
                <g key={index} className="text-[10px] fill-muted-foreground">
                    <text x={tick.x} y={chartHeight - padding.bottom + 15} textAnchor="middle">
                    {formatXAxisLabel(tick.value)}
                    </text>
                </g>
            ))}


            <path
              d={areaPathD}
              fill="url(#areaGradient)"
              className="transition-all duration-300"
            />
            <path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />

            {/* Active Point Indicator */}
            {activePoint && (
              <g>
                <line
                  x1={activePoint.x} y1={padding.top}
                  x2={activePoint.x} y2={innerHeight + padding.top}
                  stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3 3"
                />
                <circle cx={activePoint.x} cy={activePoint.y} r="8" fill="hsl(var(--primary) / 0.3)" />
                <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
              </g>
            )}

             {/* Hover Tooltip (different from active point) */}
            {hoveredPoint && hoveredPoint.index !== activeIndex && (
              <g>
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="4" fill="hsl(var(--foreground))" />
              </g>
            )}

          </svg>
        </div>
    </div>
  );
}

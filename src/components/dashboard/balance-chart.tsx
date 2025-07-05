'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { type Transaction } from "@/lib/data";

type ChartDataPoint = {
    date: Date;
    netWorth: number;
    transactions: Transaction[];
};

type BalanceChartProps = {
    chartData: ChartDataPoint[];
};

export default function BalanceChart({ chartData: dataPoints }: BalanceChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePeriod, setActivePeriod] = useState('1M');

  useEffect(() => {
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
  
  if (!dataPoints || dataPoints.length < 2) {
      return (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Not enough data to display chart.
          </div>
      )
  }

  const chartWidth = 350;
  const chartHeight = 180;
  const padding = { top: 10, right: 10, bottom: 30, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const minValue = Math.min(...dataPoints.map(d => d.netWorth));
  const maxValue = Math.max(...dataPoints.map(d => d.netWorth));
  const valueRange = maxValue - minValue === 0 ? 1 : maxValue - minValue;

  const formatValueForPath = (value: number) => {
      return padding.top + ((maxValue - value) / valueRange) * innerHeight;
  }
  
  const createPath = (points: ChartDataPoint[], progress = 1) => {
    const visiblePoints = points.slice(0, Math.ceil(points.length * progress));
    
    return visiblePoints.map((point, index) => {
      const x = padding.left + (index / (points.length - 1)) * innerWidth;
      const y = formatValueForPath(point.netWorth);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  };

  const createAreaPath = (points: ChartDataPoint[], progress = 1) => {
    const visiblePoints = points.slice(0, Math.ceil(points.length * progress));
    
    const linePath = visiblePoints.map((point, index) => {
      const x = padding.left + (index / (points.length - 1)) * innerWidth;
      const y = formatValueForPath(point.netWorth);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');

    if (visiblePoints.length === 0) return "";
    const lastX = padding.left + ((visiblePoints.length - 1) / (points.length - 1)) * innerWidth;
    
    return `${linePath} L ${lastX.toFixed(2)} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        notation: 'compact'
    }).format(value);
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const pointIndex = Math.round(((x - padding.left) / innerWidth) * (dataPoints.length - 1));
    
    if (pointIndex >= 0 && pointIndex < dataPoints.length) {
      const point = dataPoints[pointIndex];
      const pointX = padding.left + (pointIndex / (dataPoints.length - 1)) * innerWidth;
      const pointY = formatValueForPath(point.netWorth);
      
      const distance = Math.abs(x - pointX);
      
      if (distance < 15) { // Check proximity on x-axis
        setHoveredPoint({ ...point, index: pointIndex, x: pointX, y: pointY });
      } else {
        setHoveredPoint(null);
      }
    }
  };

  const visibleDates = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
    const index = Math.floor(ratio * (dataPoints.length - 1));
    return dataPoints[index];
  });


  return (
    <div className='w-full h-full flex flex-col'>
       <div className="relative flex-grow">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
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

            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1={padding.left}
                y1={padding.top + ratio * innerHeight}
                x2={chartWidth - padding.right}
                y2={padding.top + ratio * innerHeight}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ))}

            <path
              d={createAreaPath(dataPoints, animationProgress)}
              fill="url(#areaGradient)"
              className="transition-all duration-300"
            />
            <path
              d={createPath(dataPoints, animationProgress)}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
            
            {dataPoints.slice(0, Math.ceil(dataPoints.length * animationProgress)).map((point, index) => {
              if (index === dataPoints.length - 1) {
                  const x = padding.left + (index / (dataPoints.length - 1)) * innerWidth;
                  const y = formatValueForPath(point.netWorth);
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="8" fill="hsl(var(--primary) / 0.3)" className="animate-pulse" />
                      <circle cx={x} cy={y} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
                    </g>
                  )
              }
              return null;
            })}

            {hoveredPoint && (
              <g>
                <rect
                  x={hoveredPoint.x - 40}
                  y={hoveredPoint.y - 40}
                  width="80"
                  height="32"
                  fill="hsl(var(--popover))"
                  rx="6"
                  className="opacity-90"
                />
                <text
                  x={hoveredPoint.x}
                  y={hoveredPoint.y - 28}
                  textAnchor="middle"
                  className="text-xs fill-popover-foreground font-medium"
                >
                  {formatCurrency(hoveredPoint.netWorth)}
                </text>
                <text
                  x={hoveredPoint.x}
                  y={hoveredPoint.y - 16}
                  textAnchor="middle"
                  className="text-xs fill-muted-foreground"
                >
                   {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(hoveredPoint.date))}
                </text>
              </g>
            )}
            
            {visibleDates.map((point, index) => (
               <text
                    key={index}
                    x={padding.left + (dataPoints.indexOf(point) / (dataPoints.length-1)) * innerWidth}
                    y={chartHeight - (padding.bottom / 2.5)}
                    textAnchor="middle"
                    className="text-[10px] fill-muted-foreground"
                >
                    {new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(new Date(point.date))}
                </text>
            ))}

          </svg>
        </div>
        
        <div className="px-1 pt-2">
            <div className="flex gap-2">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={cn(`px-3 py-1 text-xs rounded-full transition-colors`,
                    activePeriod === period 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-secondary'
                )}
                >
                {period}
                </button>
            ))}
            </div>
        </div>
    </div>
  );
}
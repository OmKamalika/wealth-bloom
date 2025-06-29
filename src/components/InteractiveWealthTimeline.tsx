import React, { useRef, useEffect, useState } from 'react';
import { WealthProjection } from '../utils/wealthCalculations';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';

interface InteractiveWealthTimelineProps {
  projections: WealthProjection[];
  extinctionYear: number;
  currentWealth: number;
  protectedScenario?: {
    extinctionYear: number;
    projections: WealthProjection[];
  };
}

const InteractiveWealthTimeline: React.FC<InteractiveWealthTimelineProps> = ({
  projections,
  extinctionYear,
  currentWealth,
  protectedScenario
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ year: number; wealth: number; x: number; y: number } | null>(null);
  const [showProtected, setShowProtected] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedScenario, setSelectedScenario] = useState<'mostLikely' | 'bestCase' | 'worstCase'>('mostLikely');
  const { currencyInfo } = useCurrency();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Animation loop
    const animate = () => {
      if (animationProgress < 1) {
        setAnimationProgress(prev => Math.min(1, prev + 0.02));
        requestAnimationFrame(animate);
      }
    };

    animate();
    drawTimeline(ctx, rect.width, rect.height);
  }, [projections, animationProgress, showProtected, zoomLevel, panOffset, selectedScenario, currencyInfo]);

  const drawTimeline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Calculate scales
    const maxWealth = Math.max(currentWealth, ...projections.map(p => p.wealth));
    const minYear = 2025;
    const maxYear = Math.max(extinctionYear + 10, 2090);

    // Apply zoom and pan transformations
    const xScale = (year: number) => {
      const baseX = padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
      return baseX * zoomLevel + panOffset.x;
    };
    
    const yScale = (wealth: number) => {
      const baseY = height - padding - (wealth / maxWealth) * chartHeight;
      return baseY * zoomLevel + panOffset.y;
    };

    // Draw grid
    drawGrid(ctx, width, height, padding, minYear, maxYear, maxWealth, xScale, yScale);

    // Draw wealth decline path
    drawWealthPath(ctx, projections, xScale, yScale, animationProgress);

    // Draw protected scenario if enabled
    if (showProtected && protectedScenario) {
      drawProtectedPath(ctx, protectedScenario.projections, xScale, yScale, animationProgress);
    }

    // Draw key milestones
    drawMilestones(ctx, projections, xScale, yScale, extinctionYear);

    // Draw confidence bands
    if (projections.length > 0 && projections[0].confidenceLevel) {
      drawConfidenceBands(ctx, projections, xScale, yScale, animationProgress);
    }

    // Draw hover tooltip
    if (hoveredPoint) {
      drawTooltip(ctx, hoveredPoint);
    }
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    padding: number,
    minYear: number,
    maxYear: number,
    maxWealth: number,
    xScale: (year: number) => number,
    yScale: (wealth: number) => number
  ) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical grid lines (years)
    for (let year = minYear; year <= maxYear; year += 10) {
      const x = xScale(year);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // Year labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(year.toString(), x, height - padding + 20);
    }

    // Horizontal grid lines (wealth)
    for (let i = 0; i <= 5; i++) {
      const wealth = (maxWealth / 5) * i;
      const y = yScale(wealth);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Wealth labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      
      // Format wealth with locale and currency
      const formattedWealth = formatCurrency(wealth, currencyInfo, {
        maximumFractionDigits: 0,
        notation: 'compact'
      });
      
      ctx.fillText(formattedWealth, padding - 10, y + 4);
    }
  };

  const drawWealthPath = (
    ctx: CanvasRenderingContext2D,
    projections: WealthProjection[],
    xScale: (year: number) => number,
    yScale: (wealth: number) => number,
    progress: number
  ) => {
    if (projections.length === 0) return;

    const visibleProjections = projections.slice(0, Math.floor(projections.length * progress));
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.5, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');

    // Draw the main path
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    visibleProjections.forEach((projection, index) => {
      const x = xScale(projection.year);
      const y = yScale(projection.wealth);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw area under curve
    if (visibleProjections.length > 1) {
      const areaGradient = ctx.createLinearGradient(0, 0, 0, 400);
      areaGradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
      areaGradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)');
      areaGradient.addColorStop(1, 'rgba(239, 68, 68, 0.1)');

      ctx.fillStyle = areaGradient;
      ctx.beginPath();
      ctx.moveTo(xScale(visibleProjections[0].year), yScale(0));
      visibleProjections.forEach(projection => {
        ctx.lineTo(xScale(projection.year), yScale(projection.wealth));
      });
      ctx.lineTo(xScale(visibleProjections[visibleProjections.length - 1].year), yScale(0));
      ctx.closePath();
      ctx.fill();
    }

    // Draw data points
    visibleProjections.forEach((projection, index) => {
      if (index % 5 === 0) { // Show every 5th point
        const x = xScale(projection.year);
        const y = yScale(projection.wealth);
        
        ctx.fillStyle = projection.wealth > currentWealth * 0.5 ? '#10b981' : 
                       projection.wealth > currentWealth * 0.2 ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const drawProtectedPath = (
    ctx: CanvasRenderingContext2D,
    protectedProjections: WealthProjection[],
    xScale: (year: number) => number,
    yScale: (wealth: number) => number,
    progress: number
  ) => {
    const visibleProjections = protectedProjections.slice(0, Math.floor(protectedProjections.length * progress));
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    visibleProjections.forEach((projection, index) => {
      const x = xScale(projection.year);
      const y = yScale(projection.wealth);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawConfidenceBands = (
    ctx: CanvasRenderingContext2D,
    projections: WealthProjection[],
    xScale: (year: number) => number,
    yScale: (wealth: number) => number,
    progress: number
  ) => {
    const visibleProjections = projections.slice(0, Math.floor(projections.length * progress));
    
    // Draw upper confidence band (75% confidence)
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.beginPath();
    visibleProjections.forEach((projection, index) => {
      const x = xScale(projection.year);
      const upperY = yScale(projection.wealth * (1 + (1 - projection.confidenceLevel)));
      
      if (index === 0) {
        ctx.moveTo(x, upperY);
      } else {
        ctx.lineTo(x, upperY);
      }
    });
    
    // Connect to lower confidence band
    for (let i = visibleProjections.length - 1; i >= 0; i--) {
      const projection = visibleProjections[i];
      const x = xScale(projection.year);
      const lowerY = yScale(projection.wealth * (1 - (1 - projection.confidenceLevel)));
      ctx.lineTo(x, lowerY);
    }
    
    ctx.closePath();
    ctx.fill();
  };

  const drawMilestones = (
    ctx: CanvasRenderingContext2D,
    projections: WealthProjection[],
    xScale: (year: number) => number,
    yScale: (wealth: number) => number,
    extinctionYear: number
  ) => {
    // Extinction point
    const extinctionX = xScale(extinctionYear);
    const extinctionY = yScale(0);

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(extinctionX, extinctionY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Extinction label
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💀 EXTINCTION', extinctionX, extinctionY - 15);
    ctx.fillText(extinctionYear.toString(), extinctionX, extinctionY - 30);

    // Draw major life events from projections
    projections.forEach(projection => {
      if (projection.majorEvents && projection.majorEvents.length > 0) {
        const x = xScale(projection.year);
        const y = yScale(projection.wealth);
        
        // Draw event marker
        ctx.fillStyle = '#6366f1'; // Indigo color for events
        ctx.beginPath();
        ctx.arc(x, y - 15, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Only show event label on hover to avoid cluttering
        if (hoveredPoint && Math.abs(hoveredPoint.year - projection.year) < 2) {
          ctx.fillStyle = '#6366f1';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          
          // Show first event (could be enhanced to show all events)
          if (projection.majorEvents[0]) {
            const eventText = projection.majorEvents[0];
            const textWidth = ctx.measureText(eventText).width;
            
            // Draw background for better readability
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(x - textWidth/2 - 5, y - 45, textWidth + 10, 20);
            
            // Draw text
            ctx.fillStyle = '#6366f1';
            ctx.fillText(eventText, x, y - 30);
          }
        }
      }
    });
  };

  const drawTooltip = (
    ctx: CanvasRenderingContext2D,
    point: { year: number; wealth: number; x: number; y: number }
  ) => {
    const tooltipWidth = 140;
    const tooltipHeight = 70;
    const tooltipX = Math.min(point.x - tooltipWidth / 2, ctx.canvas.width - tooltipWidth - 10);
    const tooltipY = Math.max(point.y - tooltipHeight - 15, 10);

    // Tooltip background with higher opacity for better visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.beginPath();
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    ctx.fill();

    // Tooltip text with larger font for better readability
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Year: ${point.year}`, tooltipX + tooltipWidth / 2, tooltipY + 25);
    
    // Format wealth with locale and currency
    const formattedWealth = formatCurrency(point.wealth, currencyInfo, {
      maximumFractionDigits: 0
    });
    
    ctx.fillText(`Wealth: ${formattedWealth}`, tooltipX + tooltipWidth / 2, tooltipY + 50);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isDragging) {
      // Calculate pan distance
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;
      
      // Update pan offset
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      // Update drag start position
      setDragStart({ x, y });
      return;
    }

    // Find closest data point
    const padding = 60;
    const chartWidth = rect.width - 2 * padding;
    const minYear = 2025;
    const maxYear = Math.max(extinctionYear + 10, 2090);
    
    // Adjust for zoom and pan
    const adjustedX = (x - panOffset.x) / zoomLevel;
    const yearAtMouse = minYear + ((adjustedX - padding) / chartWidth) * (maxYear - minYear);
    
    const closestProjection = projections.reduce((closest, current) => {
      return Math.abs(current.year - yearAtMouse) < Math.abs(closest.year - yearAtMouse) ? current : closest;
    });

    if (closestProjection) {
      setHoveredPoint({
        year: closestProjection.year,
        wealth: closestProjection.wealth,
        x,
        y
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    // Calculate zoom factor
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    
    // Limit zoom level
    const newZoomLevel = Math.max(0.5, Math.min(3, zoomLevel * zoomFactor));
    
    setZoomLevel(newZoomLevel);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleScenarioChange = (scenario: 'mostLikely' | 'bestCase' | 'worstCase') => {
    setSelectedScenario(scenario);
    // In a real implementation, this would trigger loading different projection data
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Interactive Wealth Timeline</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProtected(!showProtected)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showProtected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showProtected ? 'Hide' : 'Show'} Protected Scenario
          </button>
          <button
            onClick={handleResetView}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Reset View
          </button>
        </div>
      </div>
      
      {/* Scenario selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleScenarioChange('mostLikely')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            selectedScenario === 'mostLikely' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Most Likely
        </button>
        <button
          onClick={() => handleScenarioChange('bestCase')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            selectedScenario === 'bestCase' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Best Case
        </button>
        <button
          onClick={() => handleScenarioChange('worstCase')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            selectedScenario === 'worstCase' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Worst Case
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-80 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        aria-label="Interactive wealth timeline chart showing wealth projection over time"
      />
      
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-full"></div>
            <span>Current Path</span>
          </div>
          {showProtected && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Protected Path</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-medium">Extinction: {extinctionYear}</div>
          <div className="text-xs">Hover to explore timeline</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="text-center">
          <span role="img" aria-label="Tip">💡</span> Tip: Use mouse wheel to zoom, click and drag to pan
        </p>
      </div>
    </div>
  );
};

export default InteractiveWealthTimeline;
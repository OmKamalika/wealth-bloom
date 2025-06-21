import React, { useRef, useEffect, useState } from 'react';
import { WealthProjection } from '../utils/wealthCalculations';

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
  }, [projections, animationProgress, showProtected]);

  const drawTimeline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    const padding = 60;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Calculate scales
    const maxWealth = Math.max(currentWealth, ...projections.map(p => p.wealth));
    const minYear = 2025;
    const maxYear = Math.max(extinctionYear + 10, 2090);

    const xScale = (year: number) => padding + ((year - minYear) / (maxYear - minYear)) * chartWidth;
    const yScale = (wealth: number) => height - padding - (wealth / maxWealth) * chartHeight;

    // Draw grid
    drawGrid(ctx, width, height, padding, minYear, maxYear, maxWealth);

    // Draw wealth decline path
    drawWealthPath(ctx, projections, xScale, yScale, animationProgress);

    // Draw protected scenario if enabled
    if (showProtected && protectedScenario) {
      drawProtectedPath(ctx, protectedScenario.projections, xScale, yScale, animationProgress);
    }

    // Draw key milestones
    drawMilestones(ctx, projections, xScale, yScale, extinctionYear);

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
    maxWealth: number
  ) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical grid lines (years)
    for (let year = minYear; year <= maxYear; year += 10) {
      const x = padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
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
      const y = height - padding - (wealth / maxWealth) * (height - 2 * padding);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Wealth labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`$${(wealth / 1000).toFixed(0)}K`, padding - 10, y + 4);
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
  };

  const drawTooltip = (
    ctx: CanvasRenderingContext2D,
    point: { year: number; wealth: number; x: number; y: number }
  ) => {
    const tooltipWidth = 120;
    const tooltipHeight = 60;
    const tooltipX = point.x - tooltipWidth / 2;
    const tooltipY = point.y - tooltipHeight - 10;

    // Tooltip background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 8);
    ctx.fill();

    // Tooltip text
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Year: ${point.year}`, tooltipX + tooltipWidth / 2, tooltipY + 20);
    ctx.fillText(`Wealth: $${(point.wealth / 1000).toFixed(0)}K`, tooltipX + tooltipWidth / 2, tooltipY + 40);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find closest data point
    const padding = 60;
    const chartWidth = rect.width - 2 * padding;
    const minYear = 2025;
    const maxYear = Math.max(extinctionYear + 10, 2090);
    
    const yearAtMouse = minYear + ((x - padding) / chartWidth) * (maxYear - minYear);
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
            onClick={() => setAnimationProgress(0)}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
          >
            Replay Animation
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-80 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
    </div>
  );
};

export default InteractiveWealthTimeline;
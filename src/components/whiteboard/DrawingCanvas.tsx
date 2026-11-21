import React, { useRef, useState, useEffect } from 'react';
import { CanvasStroke } from '../../domain/types';
import { Icons } from '../common/Icons';

export interface DrawingCanvasProps {
  initialStrokes?: CanvasStroke[];
  onStrokesChange?: (strokes: CanvasStroke[]) => void;
  errorHighlight?: { x: number; y: number; width: number; height: number; title: string } | null;
  readOnly?: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialStrokes = [],
  onStrokesChange,
  errorHighlight,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#818CF8'); // Indigo/violet
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [strokes, setStrokes] = useState<CanvasStroke[]>(initialStrokes);

  useEffect(() => {
    setStrokes(initialStrokes);
  }, [initialStrokes]);

  // Redraw canvas whenever strokes or errorHighlight changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background for mathematical whiteboard look
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    const gridSize = 25;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render strokes
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#0F172A' : stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // If an error is detected, draw the visual red breakdown box
    if (errorHighlight) {
      ctx.save();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';

      const { x, y, width, height } = errorHighlight;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Draw callout tag badge
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(x, y - 22, 170, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`⚠️ ${errorHighlight.title}`, x + 6, y - 7);
      ctx.restore();
    }
  }, [strokes, errorHighlight]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawing(true);
    const newStroke: CanvasStroke = {
      color: currentColor,
      size: currentTool === 'eraser' ? lineWidth * 4 : lineWidth,
      tool: currentTool,
      points: [{ x, y }]
    };
    setStrokes((prev) => [...prev, newStroke]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const current = prev[lastIndex];
      const updatedStroke = {
        ...current,
        points: [...current.points, { x, y }]
      };
      const updated = [...prev.slice(0, lastIndex), updatedStroke];
      if (onStrokesChange) {
        onStrokesChange(updated);
      }
      return updated;
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setStrokes([]);
    if (onStrokesChange) onStrokesChange([]);
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      const updated = prev.slice(0, -1);
      if (onStrokesChange) onStrokesChange(updated);
      return updated;
    });
  };

  const COLORS = ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#F8FAFC'];

  return (
    <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
      {/* Canvas Toolbar */}
      {!readOnly && (
        <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
          {/* Tools */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentTool('pen')}
              className={`p-1.5 rounded transition ${currentTool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Lápiz"
            >
              <Icons.PenTool className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTool('eraser')}
              className={`p-1.5 rounded transition ${currentTool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="Borrador"
            >
              <Icons.Eraser className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Colors */}
            <div className="flex items-center space-x-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrentColor(c);
                    setCurrentTool('pen');
                  }}
                  className={`w-4 h-4 rounded-full border transition ${currentColor === c && currentTool === 'pen' ? 'ring-2 ring-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Line Width */}
            <select
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-1.5 py-0.5 text-[11px]"
            >
              <option value="2">Fino (2px)</option>
              <option value="3">Medio (3px)</option>
              <option value="5">Grueso (5px)</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleUndo}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1"
              title="Deshacer trazo"
            >
              <Icons.RotateCcw className="w-3 h-3" />
              <span>Deshacer</span>
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs flex items-center space-x-1"
              title="Limpiar pizarra"
            >
              <Icons.Trash2 className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      <div className="relative w-full h-[320px] bg-[#0A0F1D] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={580}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
        {strokes.length === 0 && !errorHighlight && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs font-mono">
            ✍️ Puedes dibujar o anotar tu procedimiento aquí (Whiteboard libre)
          </div>
        )}
      </div>
    </div>
  );
};

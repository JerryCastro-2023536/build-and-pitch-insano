import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CanvasStroke } from '../../domain/types';

export interface DrawingCanvasProps {
  initialStrokes?: CanvasStroke[];
  onStrokesChange?: (strokes: CanvasStroke[]) => void;
  errorHighlight?: { x: number; y: number; width: number; height: number; title: string } | null;
  readOnly?: boolean;
}

export const TEXTILE_INKS = [
  { id: 'indigo', name: 'Índigo Maya', hex: '#1E1548' },
  { id: 'terracota', name: 'Terracota Huipil', hex: '#C2410C' },
  { id: 'jade', name: 'Jade Natural', hex: '#0D9488' },
  { id: 'azafran', name: 'Azafrán Dorado', hex: '#D97706' }
];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialStrokes = [],
  onStrokesChange,
  errorHighlight,
  readOnly = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#1E1548');
  const [strokes, setStrokes] = useState<CanvasStroke[]>(initialStrokes);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setStrokes(initialStrokes);
  }, [initialStrokes]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Reset transform & clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    // Cuadrícula sutil de cuaderno escolar
    ctx.save();
    ctx.strokeStyle = '#ece4d4';
    ctx.lineWidth = 0.8;
    const gridSize = 24;
    for (let x = 0; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Render strokes
    strokes.forEach((stroke) => {
      if (!stroke.points || stroke.points.length < 1) return;
      ctx.save();
      if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 22;
      } else if (stroke.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply';
        ctx.strokeStyle = 'rgba(13, 148, 136, 0.35)';
        ctx.lineWidth = 14;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size || 3.2;
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Error highlight if present
    if (errorHighlight) {
      ctx.save();
      ctx.strokeStyle = '#b90c55';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.fillStyle = 'rgba(185, 12, 85, 0.08)';

      const { x, y, width, height } = errorHighlight;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);

      // Badge
      ctx.fillStyle = '#b90c55';
      ctx.fillRect(x, y - 22, 180, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.fillText(`⚠️ ${errorHighlight.title}`, x + 6, y - 7);
      ctx.restore();
    }
  }, [strokes, errorHighlight]);

  // Adjust canvas size to parent container with DPI scale
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      redrawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [redrawCanvas]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const pt = getCanvasCoords(e);
    setIsDrawing(true);

    const newStroke: CanvasStroke = {
      color: currentColor,
      size: currentTool === 'eraser' ? 22 : currentTool === 'highlighter' ? 14 : 3.2,
      tool: currentTool,
      points: [pt]
    };
    setStrokes((prev) => [...prev, newStroke]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const pt = getCanvasCoords(e);

    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const current = prev[lastIndex];
      const updatedStroke = {
        ...current,
        points: [...current.points, pt]
      };
      const updated = [...prev.slice(0, lastIndex), updatedStroke];
      if (onStrokesChange) onStrokesChange(updated);
      return updated;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      const updated = prev.slice(0, -1);
      if (onStrokesChange) onStrokesChange(updated);
      return updated;
    });
  };

  const handleClear = () => {
    setStrokes([]);
    if (onStrokesChange) onStrokesChange([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="flex flex-col bg-[#fcfaf5] rounded-2xl border-2 border-[#201b0d] overflow-hidden shadow-[4px_4px_0px_#201b0d] relative">
      {/* Canvas Toolbar */}
      {!readOnly && (
        <div className="bg-white px-3 py-2 border-b border-[#e5dcce] flex flex-col gap-2">
          {/* Top row: Tools */}
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-1">
              {/* Lápiz */}
              <button
                type="button"
                onClick={() => setCurrentTool('pen')}
                className={`min-h-[40px] px-2.5 rounded-xl border flex items-center gap-1 font-mono text-xs font-bold transition-all ${
                  currentTool === 'pen'
                    ? 'bg-[#ffebd0] text-[#835500] border-2 border-[#f3cca0] shadow-xs'
                    : 'bg-transparent text-[#524534] border-transparent hover:bg-[#f6eee0]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                <span>Lápiz</span>
              </button>

              {/* Resaltador Jade */}
              <button
                type="button"
                onClick={() => setCurrentTool('highlighter')}
                className={`min-h-[40px] px-2.5 rounded-xl border flex items-center gap-1 font-mono text-xs font-bold transition-all ${
                  currentTool === 'highlighter'
                    ? 'bg-[#e6f7f5] text-[#0D9488] border-2 border-[#0D9488] shadow-xs'
                    : 'bg-transparent text-[#524534] border-transparent hover:bg-[#f6eee0]'
                }`}
              >
                <span className="material-symbols-outlined text-lg text-[#0D9488]">ink_highlighter</span>
                <span>Resaltador</span>
              </button>

              {/* Borrador */}
              <button
                type="button"
                onClick={() => setCurrentTool('eraser')}
                className={`min-h-[40px] px-2 rounded-xl border flex items-center justify-center transition-all ${
                  currentTool === 'eraser'
                    ? 'bg-[#fee2e2] text-[#93000a] border-2 border-[#fca5a5] shadow-xs'
                    : 'bg-transparent text-[#524534] border-transparent hover:bg-[#f6eee0]'
                }`}
                title="Borrador"
              >
                <span className="material-symbols-outlined text-lg">ink_eraser</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleUndo}
                className="min-h-[38px] px-2 rounded-lg bg-transparent hover:bg-[#f6eee0] text-[#524534] flex items-center gap-1 text-xs font-mono font-bold"
                title="Deshacer último trazo"
              >
                <span className="material-symbols-outlined text-base">undo</span>
                <span className="hidden sm:inline">Deshacer</span>
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="min-h-[38px] px-2 rounded-lg bg-transparent hover:bg-[#fee2e2] text-[#93000a] flex items-center gap-1 text-xs font-mono font-bold"
                title="Limpiar lienzo"
              >
                <span className="material-symbols-outlined text-base">delete_sweep</span>
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            </div>
          </div>

          {/* Bottom row: Tintas textiles */}
          <div className="flex items-center justify-between pt-1 border-t border-[#f0e7d8] px-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#857462]">
              Tintas Textiles
            </span>
            <div className="flex items-center gap-2">
              {TEXTILE_INKS.map((ink) => {
                const isSelected = currentColor === ink.hex && currentTool === 'pen';
                return (
                  <button
                    key={ink.id}
                    type="button"
                    onClick={() => {
                      setCurrentColor(ink.hex);
                      setCurrentTool('pen');
                    }}
                    title={ink.name}
                    className={`min-w-[36px] min-h-[36px] w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#201b0d] ring-offset-2 ring-offset-white scale-110 shadow-xs'
                        : 'border border-[#d7c3ae] hover:scale-105'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full block shadow-xs" 
                      style={{ backgroundColor: ink.hex }} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showClearConfirm && (
        <div className="bg-[#fff2f2] border-b border-[#fecaca] p-2.5 flex items-center justify-between gap-2 text-xs text-[#991b1b] animate-fadeIn">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="material-symbols-outlined text-base">warning</span>
            <span>¿Borrar todos los trazos del cuaderno?</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-2.5 py-1 rounded bg-white border border-[#fca5a5] font-bold text-[#991b1b]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1 rounded bg-[#dc2626] text-white font-bold"
            >
              Sí, limpiar
            </button>
          </div>
        </div>
      )}

      {/* Canvas Container with touch-none */}
      <div className="relative w-full h-[320px] sm:h-[360px] touch-none select-none bg-[#fdfbf7] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block touch-none"
        />

        {strokes.length === 0 && !errorHighlight && (
          <div className="absolute bottom-3 left-4 pointer-events-none flex items-center gap-1 text-[11px] text-[#857462] bg-white/85 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#e8dfd0]">
            <span className="material-symbols-outlined text-sm">gesture</span>
            <span>Dibuja tu desarrollo matemático en el cuaderno</span>
          </div>
        )}
      </div>
    </div>
  );
};

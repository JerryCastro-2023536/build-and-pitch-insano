import React from 'react';
import { Icons } from '../common/Icons';

export interface MathKeypadProps {
  onInsertSymbol: (symbol: string) => void;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({ onInsertSymbol }) => {
  const SYMBOLS = [
    { label: 'x²', val: '^2' },
    { label: '√', val: '\\sqrt{}' },
    { label: '( )', val: '( )' },
    { label: '±', val: '±' },
    { label: '÷', val: ' ÷ ' },
    { label: '×', val: ' \\times ' },
    { label: '+', val: ' + ' },
    { label: '-', val: ' - ' },
    { label: '=', val: ' = ' },
    { label: 'x₁', val: 'x_1' },
    { label: 'x₂', val: 'x_2' },
    { label: 'x', val: 'x' }
  ];

  return (
    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex flex-wrap gap-1 items-center">
      <span className="text-[10px] font-bold text-slate-500 mr-1 uppercase">Teclado:</span>
      {SYMBOLS.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onInsertSymbol(s.val)}
          className="px-2 py-1 rounded bg-slate-900 hover:bg-indigo-600/30 text-indigo-200 hover:text-white border border-slate-800 font-mono text-xs transition"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

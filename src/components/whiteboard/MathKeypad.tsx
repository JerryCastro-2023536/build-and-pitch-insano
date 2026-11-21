import React from 'react';

export interface MathKeypadProps {
  onInsertSymbol: (symbol: string) => void;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({ onInsertSymbol }) => {
  const SYMBOLS = [
    { label: 'x²', val: '²' },
    { label: '√', val: '√' },
    { label: '( )', val: '( )' },
    { label: '±', val: '±' },
    { label: '÷', val: ' ÷ ' },
    { label: '×', val: ' × ' },
    { label: '+', val: ' + ' },
    { label: '-', val: ' - ' },
    { label: '=', val: ' = ' },
    { label: 'x₁', val: 'x₁' },
    { label: 'x₂', val: 'x₂' },
    { label: 'x', val: 'x' }
  ];

  return (
    <div className="bg-[#fef3db] p-2 rounded-xl border-2 border-[#201b0d] shadow-[2px_2px_0px_#201b0d] flex flex-wrap gap-1.5 items-center">
      <div className="flex items-center gap-1 mr-1 text-[#835500]">
        <span className="material-symbols-outlined text-sm">keyboard</span>
        <span className="text-[10px] font-bold font-mono uppercase tracking-wider">Teclado:</span>
      </div>
      {SYMBOLS.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onInsertSymbol(s.val)}
          className="min-h-[30px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#f8edd5] text-[#201b0d] hover:text-[#835500] border border-[#d7c3ae] hover:border-[#201b0d] font-mono text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

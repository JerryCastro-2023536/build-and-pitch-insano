import React from 'react';

export interface TextileRibbonProps {
  className?: string;
  height?: string;
  variant?: 'rainbow' | 'warning' | 'success';
}

export const TextileRibbon: React.FC<TextileRibbonProps> = ({
  className = '',
  height = 'h-1.5',
  variant = 'rainbow'
}) => {
  if (variant === 'warning') {
    return (
      <div className={`w-full flex ${height} ${className}`}>
        <div className="flex-1 bg-[#ba1a1a]" />
        <div className="flex-1 bg-[#f5a623]" />
        <div className="flex-1 bg-[#b90c55]" />
        <div className="flex-1 bg-[#ba1a1a]" />
      </div>
    );
  }

  if (variant === 'success') {
    return (
      <div className={`w-full flex ${height} ${className}`}>
        <div className="flex-1 bg-[#0D9488]" />
        <div className="flex-1 bg-[#2E8B57]" />
        <div className="flex-1 bg-[#F5A623]" />
        <div className="flex-1 bg-[#0D9488]" />
      </div>
    );
  }

  return (
    <div className={`w-full flex ${height} ${className}`}>
      <div className="flex-1 bg-[#b90c55]" />
      <div className="flex-1 bg-[#f5a623]" />
      <div className="flex-1 bg-[#625499]" />
      <div className="flex-1 bg-[#0D9488]" />
      <div className="flex-1 bg-[#b90c55]" />
      <div className="flex-1 bg-[#f5a623]" />
    </div>
  );
};

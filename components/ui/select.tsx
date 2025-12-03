'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled,
  error,
  className
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full" ref={containerRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm transition-colors focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500 dark:focus:ring-zinc-800',
            isOpen && 'border-zinc-400 ring-2 ring-zinc-100 dark:border-zinc-500 dark:ring-zinc-800',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className
          )}
          disabled={disabled}
        >
          <span className={cn(!selectedOption && 'text-zinc-400')}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-zinc-500 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800',
                  option.value === value && 'bg-zinc-50 dark:bg-zinc-800'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export { Select };

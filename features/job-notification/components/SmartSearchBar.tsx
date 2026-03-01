'use client';

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SearchSuggestion {
  id: string;
  text: string;
  category: 'recent' | 'job' | 'company' | 'location';
  icon?: string;
}

interface SmartSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  className?: string;
  showRecentSearches?: boolean;
}

/**
 * SmartSearchBar - Advanced search with autocomplete, suggestions, and recent searches
 */
export function SmartSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Search jobs, companies, locations...',
  suggestions = [],
  onSuggestionClick,
  className,
  showRecentSearches = true,
}: SmartSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (showRecentSearches) {
      const stored = localStorage.getItem('recentSearches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, [showRecentSearches]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      // Save to recent searches
      const updated = [searchValue, ...recentSearches.filter((s) => s !== searchValue)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      onSearch?.(searchValue);
    }
    setIsFocused(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const allSuggestions = [...suggestions, ...recentSearches.map((text, i) => ({
      id: `recent-${i}`,
      text,
      category: 'recent' as const,
    }))];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, allSuggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          const suggestion = allSuggestions[selectedIndex];
          onChange(suggestion.text);
          handleSearch(suggestion.text);
        } else {
          handleSearch(value);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleDeleteRecentSearch = (searchText: string) => {
    const updated = recentSearches.filter((s) => s !== searchText);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recent':
        return (
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'job':
        return (
          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'company':
        return (
          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'location':
        return (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 font-semibold text-slate-900">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const showDropdown = isFocused && (suggestions.length > 0 || recentSearches.length > 0);
  const allSuggestions = [
    ...suggestions,
    ...recentSearches.map((text, i) => ({
      id: `recent-${i}`,
      text,
      category: 'recent' as const,
    })),
  ];

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border-2 bg-white px-4 py-3 transition-all',
          isFocused
            ? 'border-blue-500 ring-4 ring-blue-100'
            : 'border-slate-200 hover:border-slate-300'
        )}
      >
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none"
        />

        {value && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleClearSearch}
            className="rounded-full p-1 transition-colors hover:bg-slate-100"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        )}

        {value && (
          <button
            onClick={() => handleSearch(value)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Search
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-2xl"
          >
            <div className="max-h-80 overflow-y-auto p-2">
              {allSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange(suggestion.text);
                    onSuggestionClick?.(suggestion);
                    handleSearch(suggestion.text);
                  }}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                    selectedIndex === index ? 'bg-blue-50' : 'hover:bg-slate-50'
                  )}
                >
                  <div className="flex-shrink-0">{getCategoryIcon(suggestion.category)}</div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {highlightMatch(suggestion.text, value)}
                    </div>
                    {suggestion.category !== 'recent' && (
                      <div className="text-xs text-slate-500 capitalize">{suggestion.category}</div>
                    )}
                  </div>

                  {suggestion.category === 'recent' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecentSearch(suggestion.text);
                      }}
                      className="flex-shrink-0 rounded p-1 opacity-0 transition-all hover:bg-red-100 group-hover:opacity-100"
                      aria-label="Delete recent search"
                    >
                      <svg className="h-3.5 w-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </motion.button>
              ))}
            </div>

            {recentSearches.length > 0 && (
              <div className="border-t border-slate-200 p-2">
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('recentSearches');
                  }}
                  className="w-full rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Clear Search History
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Hint */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 flex items-center gap-4 px-2 text-xs text-slate-500"
        >
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-semibold">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-semibold">Enter</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono font-semibold">Esc</kbd>
            Close
          </span>
        </motion.div>
      )}
    </div>
  );
}

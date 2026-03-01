'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: number;
  isDefault?: boolean;
}

interface FilterPresetsProps {
  currentFilters: Record<string, any>;
  onLoadPreset: (filters: Record<string, any>) => void;
  className?: string;
}

/**
 * FilterPresets - Save, load, and manage filter combinations
 */
export function FilterPresets({ currentFilters, onLoadPreset, className }: FilterPresetsProps) {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<FilterPreset | null>(null);

  // Load presets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('filterPresets');
    if (stored) {
      setPresets(JSON.parse(stored));
    }
  }, []);

  const savePresets = (updatedPresets: FilterPreset[]) => {
    setPresets(updatedPresets);
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      filters: currentFilters,
      createdAt: Date.now(),
    };

    if (editingPreset) {
      // Update existing preset
      const updated = presets.map((p) => (p.id === editingPreset.id ? { ...newPreset, id: editingPreset.id } : p));
      savePresets(updated);
    } else {
      // Add new preset
      savePresets([...presets, newPreset]);
    }

    setPresetName('');
    setIsSaveDialogOpen(false);
    setEditingPreset(null);
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    onLoadPreset(preset.filters);
    setIsOpen(false);
  };

  const handleDeletePreset = (presetId: string) => {
    const updated = presets.filter((p) => p.id !== presetId);
    savePresets(updated);
  };

  const handleSetDefault = (presetId: string) => {
    const updated = presets.map((p) => ({
      ...p,
      isDefault: p.id === presetId,
    }));
    savePresets(updated);
  };

  const handleEditPreset = (preset: FilterPreset) => {
    setEditingPreset(preset);
    setPresetName(preset.name);
    setIsSaveDialogOpen(true);
  };

  const defaultPreset = presets.find((p) => p.isDefault);

  // Count active filters
  const activeFilterCount = Object.values(currentFilters).filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value !== '' && value !== 'all';
    return false;
  }).length;

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-2">
        {/* Save Current Filters Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSaveDialogOpen(true)}
          disabled={activeFilterCount === 0}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
            activeFilterCount > 0
              ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
              : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Save Filters
        </motion.button>

        {/* Load Presets Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all',
            presets.length > 0
              ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          My Presets {presets.length > 0 && `(${presets.length})`}
          <svg
            className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Save Dialog */}
      <AnimatePresence>
        {isSaveDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setIsSaveDialogOpen(false);
                setEditingPreset(null);
                setPresetName('');
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[110] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {editingPreset ? 'Rename Preset' : 'Save Filter Preset'}
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                {editingPreset
                  ? 'Enter a new name for this preset'
                  : 'Give your current filter combination a name to reuse it later'}
              </p>
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                placeholder="e.g., Remote Frontend Jobs"
                autoFocus
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsSaveDialogOpen(false);
                    setEditingPreset(null);
                    setPresetName('');
                  }}
                  className="flex-1 rounded-lg border-2 border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="flex-1 rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {editingPreset ? 'Rename' : 'Save Preset'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Presets Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-2xl"
          >
            {presets.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="mt-3 text-sm font-medium text-slate-600">No saved presets yet</p>
                <p className="mt-1 text-xs text-slate-500">Save your current filters to quickly reuse them later</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto p-2">
                {presets.map((preset, index) => (
                  <motion.div
                    key={preset.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-lg border border-transparent p-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => handleLoadPreset(preset)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{preset.name}</span>
                          {preset.isDefault && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {Object.keys(preset.filters).length} filters • {new Date(preset.createdAt).toLocaleDateString()}
                        </p>
                      </button>

                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleSetDefault(preset.id)}
                          className="rounded p-1.5 transition-colors hover:bg-green-100"
                          title="Set as default"
                        >
                          <svg className="h-4 w-4 text-green-600" fill={preset.isDefault ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditPreset(preset)}
                          className="rounded p-1.5 transition-colors hover:bg-blue-100"
                          title="Rename"
                        >
                          <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="rounded p-1.5 transition-colors hover:bg-red-100"
                          title="Delete"
                        >
                          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

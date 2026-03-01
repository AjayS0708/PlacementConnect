'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useState } from 'react';

interface FormFieldProps {
  label?: string;
  error?: string;
  success?: string;
  info?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  success,
  info,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-start gap-2 text-sm text-red-600"
          >
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {success && !error && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-start gap-2 text-sm text-emerald-600"
          >
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </motion.div>
        )}

        {info && !error && !success && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-start gap-2 text-sm text-blue-600"
          >
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>{info}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  error,
  success,
  icon,
  className,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="relative"
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      
      <input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={cn(
          'w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium transition-all',
          icon && 'pl-12',
          error
            ? 'border-red-300 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : success
            ? 'border-emerald-300 text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            : 'border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          'focus:outline-none',
          className
        )}
      />

      {/* Validation icon */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {error ? (
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: string;
}

export function FormTextarea({
  error,
  success,
  className,
  ...props
}: FormTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      <textarea
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={cn(
          'w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium transition-all',
          error
            ? 'border-red-300 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : success
            ? 'border-emerald-300 text-emerald-900 placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            : 'border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          'focus:outline-none resize-none',
          className
        )}
      />
    </motion.div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  success?: string;
}

export function FormSelect({
  error,
  success,
  className,
  children,
  ...props
}: FormSelectProps) {
  return (
    <select
      {...props}
      className={cn(
        'w-full rounded-xl border-2 bg-white px-4 py-3 text-sm font-medium transition-all appearance-none cursor-pointer',
        error
          ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
          : success
          ? 'border-emerald-300 text-emerald-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          : 'border-slate-200 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
        'focus:outline-none',
        className
      )}
    >
      {children}
    </select>
  );
}

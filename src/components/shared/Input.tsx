"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={inputId}
        className="text-xs uppercase tracking-widest text-muted font-body"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full border-b-2 bg-transparent pb-2 text-ink outline-none transition-colors duration-200 font-body ${
          error ? "border-error" : "border-border focus:border-accent"
        }`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-error"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}

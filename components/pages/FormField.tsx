"use client";

import { cn } from "@/lib/utils";

type FieldType = "text" | "email" | "tel" | "textarea" | "select";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
  error?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  showCounter?: boolean;
  rows?: number;
  autoComplete?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  helperText,
  options,
  error,
  value,
  onChange,
  maxLength,
  showCounter = false,
  rows = 5,
  autoComplete,
}: FormFieldProps) {
  const id = `field-${name}`;
  const hasError = Boolean(error);
  const describedBy = hasError
    ? `${id}-error`
    : helperText
      ? `${id}-help`
      : undefined;

  const baseClasses = cn(
    "w-full rounded-lg border bg-white px-4 py-3 text-[15px] leading-6 text-on-surface",
    "placeholder:text-on-surface-variant/60",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary",
    hasError
      ? "border-error focus:ring-error/30 focus:border-error"
      : "border-outline-variant hover:border-outline",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[14px] font-semibold tracking-tight text-on-surface"
      >
        {label}
        {required && (
          <span className="text-error ml-1" aria-hidden>
            *
          </span>
        )}
      </label>

      {type === "textarea" ? (
        <div className="relative">
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            aria-required={required}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            maxLength={maxLength}
            rows={rows}
            className={cn(baseClasses, "resize-none")}
          />
          {showCounter && maxLength && (
            <span className="absolute bottom-2 right-3 text-[11px] font-medium text-on-surface-variant/70">
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      ) : type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={cn(baseClasses, "appearance-none pr-10 bg-no-repeat")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2343474f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
            backgroundPosition: "right 14px center",
            backgroundSize: "16px",
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={baseClasses}
        />
      )}

      {hasError ? (
        <p
          id={`${id}-error`}
          className="text-[12px] font-medium text-error flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={`${id}-help`}
          className="text-[12px] text-on-surface-variant/85"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

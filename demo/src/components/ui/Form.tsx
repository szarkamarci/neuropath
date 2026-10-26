import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

// DESIGN.md "Form Inputs": 48px, 8px radius, 1.5px #E2E8F0 border, teal focus ring.
const controlBase =
  'w-full rounded-lg border-[1.5px] border-hairline bg-white text-body-md text-on-surface placeholder:text-muted ' +
  'transition-[border-color,box-shadow] duration-150 outline-none ' +
  'focus:border-teal focus:shadow-focus focus-visible:outline-none disabled:bg-surface-container-low disabled:text-muted';

interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-label-lg text-navy">
        {label}
      </label>
      {children}
      {hint && <p className="text-body-sm text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, 'h-12 px-4', className)} {...rest} />;
}

export function TextArea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, 'min-h-24 px-4 py-3 leading-6', className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select className={cn(controlBase, 'h-12 cursor-pointer appearance-none pr-10 pl-4')} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-on-surface-variant" />
    </div>
  );
}

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, description, disabled }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-3', disabled && 'cursor-not-allowed opacity-50')}>
      <input
        id={id}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
          'peer-focus-visible:shadow-focus',
          checked ? 'border-teal bg-teal text-white' : 'border-hairline bg-white',
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>
      <span>
        <span className="block text-body-md font-medium text-navy">{label}</span>
        {description && <span className="block text-body-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-body-md font-medium text-navy">{label}</span>
        {description && <span className="block text-body-sm text-muted">{description}</span>}
      </span>
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-teal' : 'bg-surface-container-highest',
        )}
      >
        <span
          className={cn(
            'size-5 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}

export interface SegmentOption<V extends string> {
  value: V;
  label: ReactNode;
}

interface SegmentedControlProps<V extends string> {
  options: ReadonlyArray<SegmentOption<V>>;
  value: V | null;
  onChange: (value: V) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
}

/** Pill-group selector, used for Yes/No and frequency answers. */
export function SegmentedControl<V extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  className,
}: SegmentedControlProps<V>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn('inline-flex rounded-full border border-outline-variant/40 bg-surface-container-low p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full font-semibold whitespace-nowrap transition-all duration-150',
              size === 'sm' ? 'h-7 px-3 text-label-md' : 'h-9 px-4 text-label-lg',
              selected ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-navy',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

/** Labelled range input; the label is exposed to assistive tech and tests. */
export function Slider({ value, onChange, label, min = 0, max = 100 }: SliderProps) {
  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-teal"
    />
  );
}

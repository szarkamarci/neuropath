import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'dark' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Variants follow DESIGN.md "Buttons" and the code.html hero/intro buttons.
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-teal text-white hover:bg-teal-hover shadow-sm',
  secondary: 'bg-transparent text-teal border-[1.5px] border-teal hover:bg-mint',
  tertiary: 'bg-white text-navy border border-hairline hover:shadow-sm',
  dark: 'bg-primary-container text-on-primary hover:bg-tertiary-container shadow-sm',
  ghost: 'bg-transparent text-on-surface-variant hover:text-secondary hover:bg-surface-container-low',
  danger: 'bg-white text-error border border-error/30 hover:bg-error-container/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-label-md gap-1.5',
  md: 'h-11 px-5 text-label-lg gap-2',
  lg: 'h-12 px-7 text-label-lg gap-2',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', iconLeft, iconRight, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:pointer-events-none disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
});

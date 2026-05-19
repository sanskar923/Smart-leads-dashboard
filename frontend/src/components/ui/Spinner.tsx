import { cn } from '../../utils/cn';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Spinner = ({ className, size = 'md' }: SpinnerProps) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-brand-200 border-t-brand-600',
      sizes[size],
      className
    )}
  />
);

export const PageLoader = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <Spinner size="lg" />
  </div>
);

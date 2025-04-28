import { cn } from '@/lib/utils';
import React from 'react';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'border-1 flex  h-10 w-full rounded border border-foreground bg-foreground px-3 py-2 pl-3 text-sm placeholder-opacity-10 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium   placeholder:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  disabled:cursor-not-allowed disabled:opacity-50 ',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };

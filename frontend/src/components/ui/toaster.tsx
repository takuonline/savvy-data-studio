'use client';

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
    const { toasts } = useToast();

    return (
        <ToastProvider>
            {toasts.map(function ({
                id,
                title,
                description,
                action,
                ...props
            }) {
                return (
                    <Toast
                        key={id}
                        {...props}
                        className={`max-h-[20rem] max-w-[50rem] rounded-xl border-none ${props.className}`}
                    >
                        <div className="grid gap-1 overflow-y-auto text-white ">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && (
                                <ToastDescription className={`text-xs `}>
                                    {description}
                                </ToastDescription>
                            )}
                        </div>
                        {action}
                        <ToastClose className="text-red-600 hover:text-red-600/60" />
                    </Toast>
                );
            })}
            <ToastViewport />
        </ToastProvider>
    );
}

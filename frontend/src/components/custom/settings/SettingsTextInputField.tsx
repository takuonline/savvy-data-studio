import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@hookform/error-message';
import { ChangeEventHandler } from 'react';
import {
    FieldErrors,
    FieldValues,
    UseFormRegisterReturn,
} from 'react-hook-form';

type SettingsTextInputFieldProps = InputProps & {
    labelTitle?: string;
    description?: string;
    formRegister: UseFormRegisterReturn;
    errors?: FieldErrors<FieldValues>;
    onChange?: ChangeEventHandler<HTMLInputElement>;
};
export function SettingsTextInputField({
    labelTitle,
    description,
    errors,
    formRegister,
    ...inputProps
}: SettingsTextInputFieldProps) {
    return (
        <div className="mb-3 w-full ">
            <Label className="text-xs ">{labelTitle}</Label>
            <Input
                type="text"
                className="mt-2"
                {...inputProps}
                {...formRegister}
            />
            <p className="mb-1 text-[10px] font-normal text-muted-foreground">
                {description ?? ''}
            </p>

            <div className="mb-2 text-xs text-destructive">
                <ErrorMessage errors={errors} name={inputProps.name ?? ''} />
            </div>
        </div>
    );
}

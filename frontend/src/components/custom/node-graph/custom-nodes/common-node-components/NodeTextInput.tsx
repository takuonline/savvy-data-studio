import { Textarea } from '@/components/ui/textarea';
import { UseFormRegisterReturn } from 'react-hook-form';

type NodeTextInputProps = {
    placeholder?: string;
    textValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    register?: UseFormRegisterReturn;
};
export default function NodeTextInput({
    placeholder,
    onChange,
    textValue,
    className,
    register,
}: NodeTextInputProps) {
    return (
        <Textarea
            {...register}
            className={` min-h-full w-full  border-none  text-xs placeholder:opacity-40 ${className}`}
            placeholder={placeholder ?? 'Type your message here.'}
            onChange={onChange}
            value={textValue}
        />
    );
}

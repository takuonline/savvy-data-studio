'use client';

import AuthUiWrapper from '@/components/custom/AuthUiWrapper';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import AuthenticationService from '@/services/AuthenticationService';
import { AuthLoginCredentials } from '@/types/authTypes';
import { isAxiosError } from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

export default function LoginForm({ error }: { error?: string }) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = async (d) => {
        setErrorMessage('');

        try {
            await AuthenticationService.login(d as AuthLoginCredentials);
            router.push('/admin/dashboard');
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                setErrorMessage(error.message);

                if (error.response.status == 401) {
                    setErrorMessage('Invalid username or password');
                }
            } else {
                setErrorMessage('Error connecting to server');
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword((oldState) => !oldState);
    };
    return (
        <AuthUiWrapper title={'Login'} className="w-full max-w-[30rem]">
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <CardContent className="space-y-4">
                    <div className="border-opacity-10">
                        <Input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent"
                            {...register('username', {
                                required: 'This field is required',
                                maxLength: {
                                    value: 70,
                                    message:
                                        'You have exceeded the max length of this field of 70',
                                },
                            })}
                        />
                        {formState.errors.username && (
                            <div className="text-xs text-red-600">
                                {formState.errors.username.message?.toString() ||
                                    'Invalid username'}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="relative w-full">
                            <Input
                                id="password"
                                className="bg-transparent"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                {...register('password', {
                                    required: 'This field is required',
                                    maxLength: {
                                        value: 70,
                                        message:
                                            'You have exceeded the max length of this field of 70',
                                    },
                                })}
                            />
                            <div
                                className="absolute bottom-[50%] right-4 translate-y-2/4 cursor-pointer"
                                onClick={handleShowPassword}
                            >
                                {!showPassword && (
                                    <EyeOffIcon className="size-4 opacity-80" />
                                )}
                                {showPassword && (
                                    <EyeIcon className="size-4 opacity-80" />
                                )}
                            </div>
                        </div>
                        {formState.errors.password && (
                            <div className="text-xs text-red-600">
                                {formState.errors.password.message?.toString() ||
                                    'Invalid password'}
                            </div>
                        )}
                    </div>
                </CardContent>

                <div className="mt-5 flex w-full justify-center">
                    <Button
                        type="submit"
                        className="mx-6 w-full justify-self-center rounded hover:bg-foreground"
                        disabled={formState.isSubmitting}
                    >
                        {formState.isSubmitting ? <LoadingSpinner /> : 'Login'}
                    </Button>
                </div>
            </form>

            <CardFooter className="block space-y-3">
                {errorMessage && (
                    <p className="text-center text-red-600">{errorMessage}</p>
                )}

                {errorMessage && (
                    <p className="text-center text-sm text-red-600">
                        Please try another login method or contact support at
                        team@clipbard.com
                    </p>
                )}

                <div className="mt-2 flex items-center justify-center">
                    <p className="text-sm text-white/50">
                        {"Don't have an account? "}
                    </p>
                    <Button asChild variant="link" className="p-1 font-bold">
                        <Link href="/create-account">Create account</Link>
                    </Button>
                </div>
            </CardFooter>
        </AuthUiWrapper>
    );
}

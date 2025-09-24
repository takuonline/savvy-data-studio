'use client';

import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import AuthenticationService from '@/services/AuthenticationService';
import { AuthLoginCredentials } from '@/types/authTypes';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { CardFooter } from '../ui/card';

export default function LoginForm({ error }: { error?: string }) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const { register, handleSubmit, formState, } = useForm();


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
        <form
            className={cn('m-0 flex w-[20rem] flex-col gap-6')}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="mx-4 text-2xl font-bold">Login</h1>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    {/* <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        className="border-border"
                        {...register('email', {
                            required: 'This field is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                    /> */}

                    <Input
                        type="text"
                        placeholder="Username"
                        {...register('username', {
                            required: 'This field is required',
                            maxLength: {
                                value: 70,
                                message:
                                    'You have exceeded the max length of this field of 70',
                            },
                        })}
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            className="border border-border"
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
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={handleShowPassword}
                        >
                            {showPassword ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                    <line x1="2" x2="22" y1="2" y2="22"></line>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            )}
                        </button>
                    </div>
                    {formState.errors.password && (
                        <div className="text-xs text-destructive">
                            <div>
                                {formState.errors.password.message?.toString() ||
                                    'Invalid password'}
                            </div>
                        </div>
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full rounded hover:bg-muted"
                    disabled={formState.isSubmitting}
                >
                    {formState.isSubmitting ? <LoadingSpinner /> : 'Login'}
                </Button>
            </div>
            {errorMessage && (
                <p className="text-center text-sm text-destructive">
                    {errorMessage}
                </p>
            )}

            {errorMessage && (
                <p className="text-center text-sm text-destructive">
                    {
                        'Please try another login method or contact support at team@clipbard.com'
                    }
                </p>
            )}

            <CardFooter className="mb-5 flex justify-center p-0">
                <p className="text-sm text-white/50">
                    {"Don't have an account? "}{' '}
                    <Link
                        href="/signup"
                        className="font-bold text-primary opacity-100"
                    >
                        Create account
                    </Link>
                </p>
            </CardFooter>
        </form>
    );

}

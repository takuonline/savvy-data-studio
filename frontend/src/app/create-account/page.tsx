'use client';

import AuthUiWrapper from '@/components/custom/AuthUiWrapper';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthenticationService from '@/services/AuthenticationService';
import { AuthSignupCredentials, AuthTokens } from '@/types/authTypes';
import { ErrorMessage } from '@hookform/error-message';
import { Link } from '@radix-ui/themes';
// import { setAuthStatus, setTokens } from "@/features/auth/authSlice";
import { AxiosError, AxiosResponse } from 'axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import { useAppDispatch } from '../hooks';

export default function CreateAccount() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [requestMessage, setRequestMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<{
        showPassword: boolean;
        showConfirmPassword: boolean;
    }>({
        showPassword: false,
        showConfirmPassword: false,
    });
    const {
        register,
        handleSubmit,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm();

    const onSubmit: SubmitHandler<FieldValues> = async (d) => {
        setIsLoading(true);
        clearErrors();
        const response = await AuthenticationService.signUp(
            d as AuthSignupCredentials,
        );

        if (response.status?.toString().startsWith('2')) {
            setRequestMessage('');
            // dispatch(setAuthStatus(true));

            // dispatch(setTokens((response as AxiosResponse).data.token as AuthTokens));
            setIsLoading(false);
            router.push('/admin/dashboard');
        } else if (response instanceof AxiosError) {
            setRequestMessage((response as AxiosError).message);
        } else {
            console.log(response);

            setRequestMessage('Error connecting to server');
        }

        setIsLoading(false);
    };

    const handleShowPassword = () => {
        setShowPassword((oldState) => ({
            ...oldState,
            showPassword: !oldState.showPassword,
        }));
    };

    const handleShowConfirmPassword = () => {
        setShowPassword((oldState) => ({
            ...oldState,
            showConfirmPassword: !oldState.showConfirmPassword,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
            <AuthUiWrapper title={'Create an Account'} className="w-full max-w-[30rem]">
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    <CardContent className=" space-y-4">
                        <div className="border-opacity-10">
                            {/* <Label htmlFor="email">Email</Label> */}
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent"
                                {...register('email', {
                                    required: true,
                                    maxLength: {
                                        value: 70,
                                        message:
                                            'You have exceeded the max length of this field of 70',
                                    },
                                })}
                                style={{}}
                            />

                            <div className="text-xs text-red-600 ">
                                <ErrorMessage errors={errors} name="email" />
                            </div>
                        </div>

                        <div className="">
                            {/* <Label htmlFor="username">Username</Label> */}
                            <Input
                                id="username"
                                placeholder="Username"
                                className="bg-transparent"
                                type="text"
                                {...register('username', {
                                    required: 'This field is required',
                                    maxLength: {
                                        value: 50,
                                        message:
                                            'You have exceeded the max length of this field of 50',
                                    },
                                })}
                            />
                            <div className="text-xs text-red-600 ">
                                <ErrorMessage errors={errors} name="username" />
                            </div>
                        </div>

                        <div>
                            <div className="relative w-full ">
                                <Input
                                    id="password"
                                    className="bg-transparent"
                                    type={
                                        showPassword.showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Password"
                                    {...register('password', {
                                        required: true,
                                        maxLength: {
                                            value: 70,
                                            message:
                                                'You have exceeded the max length of this field of 70',
                                        },
                                    })}
                                />

                                <div
                                    className="absolute  bottom-[50%]  right-4 translate-y-2/4   "
                                    onClick={handleShowPassword}
                                >
                                    {!showPassword.showPassword && (
                                        <EyeOffIcon className="size-4 opacity-80" />
                                    )}

                                    {showPassword.showPassword && (
                                        <EyeIcon className="size-4 opacity-80" />
                                    )}
                                </div>
                            </div>

                            <div className="text-xs text-red-600 ">
                                <ErrorMessage errors={errors} name="password" />
                            </div>
                        </div>

                        <div>
                            <div className="relative w-full ">
                                {/* <Label htmlFor="confirmPassword">Confirm Password</Label> */}
                                <Input
                                    id="confirmPassword"
                                    className="bg-transparent"
                                    type={
                                        showPassword.showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword', {
                                        required: 'This field is required',
                                        maxLength: {
                                            value: 50,
                                            message:
                                                'You have exceeded the max length of this field of 50',
                                        },

                                        validate: (val: string) => {
                                            if (watch('password') != val) {
                                                return 'The passwords do not match';
                                            }
                                        },
                                    })}
                                />

                                <div
                                    className=" absolute bottom-[50%] right-4 translate-y-2/4  "
                                    onClick={handleShowConfirmPassword}
                                >
                                    {!showPassword.showConfirmPassword && (
                                        <EyeOffIcon className="size-4 opacity-80" />
                                    )}

                                    {showPassword.showConfirmPassword && (
                                        <EyeIcon className="size-4 opacity-80" />
                                    )}

                                    {/* {showPassword.showConfirmPassword &&  } */}
                                </div>
                            </div>

                            <div className="text-xs text-red-600 ">
                                <ErrorMessage
                                    errors={errors}
                                    name="confirmPassword"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <div className="mt-5 flex w-full justify-center">
                        <Button
                            type="submit"
                            className="w-8/12 justify-self-center rounded hover:bg-foreground "
                        >
                            Create account
                        </Button>
                    </div>
                </form>
                <CardFooter className="block space-y-3">
                    {requestMessage && (
                        <p className="text-center text-red-600">
                            {' '}
                            {requestMessage}
                        </p>
                    )}

                    <div className="mt-2 flex items-center justify-center">
                        <p className="text-white/50 text-sm">{'Already have an account? '}</p>

                        <Button asChild variant="link" className="p-1 font-bold">
                            <Link href="/login"> {'Login'}</Link>
                        </Button>
                    </div>

                    {isLoading && <p className=" w-full text-center"> Loading </p>}
                </CardFooter>
            </AuthUiWrapper>
        </div>
    );
}

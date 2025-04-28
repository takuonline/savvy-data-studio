'use client';

import AuthUiWrapper from '@/components/custom/AuthUiWrapper';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { ShowPasswordComponent } from '@/components/custom/ShowPasswordComponent';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AuthenticationService from '@/services/AuthenticationService';
import { AuthLoginCredentials } from '@/types/authTypes';
import { ErrorMessage } from '@hookform/error-message';
import { isAxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// export default function LoginForm() {
//     const router = useRouter();
//     const [errorMessage, setErrorMessage] = React.useState<string>('');
//     const [showPassword, setShowPassword] = React.useState<boolean>(false);
//     const {
//         register,
//         handleSubmit,

//         formState: { errors, isSubmitting },
//     } = useForm();

//     const onSubmit: SubmitHandler<FieldValues> = async (d) => {
//         setErrorMessage('');

//         try {
//             const response = await AuthenticationService.login(
//                 d as AuthLoginCredentials,
//             );

//             router.push('/admin/dashboard');
//         } catch (error) {
//             console.log(error);

//             if (isAxiosError(error) && error.response) {
//                 toast.error(error.message);
//                 setErrorMessage(error.message);

//                 if (error.response.status == 401) {
//                     setErrorMessage('Invalid username or password');
//                     toast.error('Invalid username or password');
//                 }
//             } else {
//                 toast.error('Error connecting to server');
//             }
//         }
//     };

//     const handleShowPassword = () => {
//         setShowPassword((oldState) => !oldState);
//     };

//     return (
//         <AuthUiWrapper
//             title={'Login to your account'}
//             className=" w-4/12 "
//         >
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-5">
//                 <div className="">
//                     <Input
//                         type="text"
//                         placeholder="Username"
//                         {...register('username', {
//                             required: 'This field is required',
//                             maxLength: {
//                                 value: 70,
//                                 message:
//                                     'You have exceeded the max length of this field of 70',
//                             },
//                         })}
//                     />

//                     <div className="text-xs text-red-600 ">
//                         <ErrorMessage errors={errors} name="username" />
//                     </div>
//                 </div>

//                 <div className="">
//                     <div className="relative flex w-full items-center justify-center">
//                         <Input
//                             id="password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             {...register('password', {
//                                 required: 'This field is required',
//                                 maxLength: {
//                                     value: 70,
//                                     message:
//                                         'You have exceeded the max length of this field of 70',
//                                 },
//                             })}
//                         />

//                         <ShowPasswordComponent
//                             showText={showPassword}
//                             handleShowText={handleShowPassword}
//                             className="    "
//                         />
//                     </div>
//                     {errors.password && (
//                         <div className="text-xs text-red-600">
//                             <ErrorMessage errors={errors} name="password" />
//                         </div>
//                     )}
//                 </div>

//                 <Button
//                     type="submit"
//                     className="w-full rounded bg-primary "
//                     variant="ghost"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? <LoadingSpinner /> : 'Login'}
//                 </Button>

//                 {errorMessage && (
//                     <p className=" mb-2 text-center text-sm text-red-600 ">
//                         {errorMessage}
//                     </p>
//                 )}
//             </form>

//             {/* {isSubmitting && (
//         <p className="text-primary text-center py-4">
//           {" "}
//           <LoadingSpinner /> Loading...
//         </p>
//       )} */}

//             <div className="flex items-center justify-center text-xs ">
//                 <p className="opacity-50 ">{'Don’t have an account?  '}</p>
//                 <Link
//                     href="/create-account"
//                     className="p-1 font-bold text-primary "
//                 >
//                     {' '}
//                     {'Create account'}
//                 </Link>
//             </div>
//         </AuthUiWrapper>
//     );
// }

export default function LoginForm() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm();

    React.useEffect(() => {
        setIsSubmitting(formState.isSubmitting);
    }, [formState.isSubmitting]);

    const onSubmit: SubmitHandler<FieldValues> = async (d) => {
        setErrorMessage('');

        try {
            const response = await AuthenticationService.login(
                d as AuthLoginCredentials,
            );

            router.push('/admin/dashboard');
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                toast.error(error.message);
                setErrorMessage(error.message);

                if (error.response.status == 401) {
                    setErrorMessage('Invalid username or password');
                    toast.error('Invalid username or password');
                }
            } else {
                toast.error('Error connecting to server');
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword((oldState) => !oldState);
    };

    return (
        <AuthUiWrapper title={'Login'} className=" m-0 w-[32rem]">
            <CardContent className="grid gap-4 ">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 bg-transparent px-1 "
                >
                    <div className="">
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

                        {/* <div className="text-destructive text-xs ">
                <ErrorMessage formState.errors={formState.errors} name="username" />
              </div> */}
                    </div>

                    <div className="">
                        <div className="relative w-full ">
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

                            <ShowPasswordComponent
                                showPassword={showPassword}
                                handleShowPassword={handleShowPassword}
                            />
                        </div>

                        {formState.errors.password && (
                            <div className="text-xs text-destructive">
                                <>{formState.errors.password.message}</>
                                {/* <ErrorMessage formState.errors={formState.errors} name="password" /> */}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-6">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded "
                            variant={'default'}
                        >
                            {isSubmitting ? <LoadingSpinner /> : 'Login'}
                        </Button>

                        <div className="flex gap-2">
                            {/* <Button
                  type="button"
                  disabled={isSubmitting}
                  className="w-full rounded bg-white/10 border-white/30"
                  variant="outline"
                  onClick={() => {
                    setIsSubmitting(true);
                    router.push(`${constants.API_BASE_URL}/googleauth/login/`);
                  }}
                >
                  {isSubmitting ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <IconGoogle className={"mr-3 size-4"} />
                      <p>{"Google"}</p>
                    </>
                  )}
                </Button> */}
                            {/* <Button
                  type="button"
                  disabled={isSubmitting}
                  className="w-full rounded  "
                  variant="outline"
                  onClick={() => handleSocialAuth('github')}
                >
                  <IconGitHub className={'mr-3 size-4'} />
                  {'Github'}
                </Button> */}
                            {/* <Button
                  type="button"
                  disabled={isSubmitting}
                  className="w-full rounded  "
                  variant="outline"
                  onClick={() => handleSocialAuth('linkedin',true)}
                >
                  <IconLinkedIn className={'mr-3 size-4'} />
                  {'LinkedIn'}
                </Button> */}
                        </div>

                        {errorMessage && (
                            <p className=" mb-2 text-center text-sm text-destructive ">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </form>
            </CardContent>

            <CardFooter className="mb-5 flex justify-center">
                <p className="text-sm text-white/50">
                    {"Don't have an account?"}{' '}
                    <Link
                        href="/signup"
                        className="font-bold text-primary opacity-100"
                    >
                        Create account
                    </Link>
                </p>
            </CardFooter>
        </AuthUiWrapper>
    );
}

'use client';

import { HostSignInFormSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAlertDialog } from '@/context/ModalContext';

export default function SignInForm() {
  type Inputs = z.infer<typeof HostSignInFormSchema>;
  const { setError, setSuccess } = useAlertDialog();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const router = useRouter();

  const form = useForm<Inputs>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(HostSignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { register, handleSubmit, watch, reset, trigger, formState } = form;

  async function processForm(data: Inputs) {
    const { email, password } = data;
    signIn('hostcredentials', {
      redirect: false,
      email,
      password,
    })
      .then((resp) => {
        if (!resp) {
          throw Error('Sign up failed unexpectedly!');
        }
        if (!resp.ok) {
          throw Error('Bad email or password!');
        } else {
          router.push(callbackUrl);
        }
      })
      .catch((error) => {
        setError(error, 3);
        reset({ email: '', password: '' });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(processForm)} className="w-full space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem id="email">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@address.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Login
        </Button>
      </form>
      <p className="text-center text-md text-gray-600 mt-5">
        If you don&apos;t have an account, please
        <Link
          className="text-blue-500 hover:underline ml-1"
          href="/auth/signup"
        >
          sign up
        </Link>
      </p>
    </Form>
  );
}
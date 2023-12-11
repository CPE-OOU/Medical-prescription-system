'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { TypeOf, object, string } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
const formSchema = object({
  email: string().email(),
  password: string(),
});

type SigninFormData = TypeOf<typeof formSchema>;

export default function SignInPage() {
  const form = useForm<SigninFormData>({ resolver: zodResolver(formSchema) });
  const [signingUser, setSigningUser] = useState(false);
  const router = useRouter();

  const signUserIn = form.handleSubmit(async function signUserIn(formData) {
    setSigningUser(true);
    try {
      await signIn('credentials', formData);
      router.push('/');
      toast.success('Account', { description: 'User logged in succesfully' });
    } catch (e) {
      toast.error('Account', { description: 'User logged failed' });
    } finally {
      setSigningUser(false);
    }
  });

  return (
    <div className="py-[60px] w-[336px] mx-auto">
      <div className="flex items-center flex-col">
        <div className="relative w-14 h-14 mb-6">
          <Image src="/icons/logo.svg" fill alt="logo" />
        </div>
        <h3 className="font-tt-commons font-bold text-4xl leading-[36px] mb-2">
          Welcome back
        </h3>
        <p className="text-lg font-medium leading-[26px] text-[#757B82]  text-center">
          Please enter your email and password to log in.
        </p>
      </div>

      <div className="text-center space-y-6">
        <div className="flex items-center gap-x-4 justify-center mt-8">
          <Button
            variant="outline"
            className="btn-1 px-6 py-[10px] items-center gap-x-3"
            disabled={signingUser}
          >
            <Icon src="/icons/google.svg" />
            Google
          </Button>
          <Button
            variant="outline"
            className="btn-1 px-6 py-[10px] items-center gap-x-3"
            disabled={signingUser}
          >
            <Icon src="/icons/apple.svg" />
            Apple
          </Button>
        </div>

        <p className="body-4 text-[#757B82]">Or continue manually with email</p>
        <div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={signUserIn}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative focus-within:border-primary border-[#757B82] border transition space-y-0 p-[2px] rounded-md">
                    <FormControl>
                      <Input
                        {...field}
                        className="peer px-4 py-4 !border-none !outline-none !ring-0 relative shadow-none rounded-md"
                        placeholder="Enter Your email"
                        disabled={signingUser}
                      />
                    </FormControl>
                    <FormLabel
                      className="absolute hidden  peer-focus:block left-6 
                      top-0 -translate-y-[70%] bg-white px-[10px]
                      text-lg font-medium text-[#757B82] leading-[26px] pb-0 m-0 "
                    >
                      Email
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative focus-within:border-primary border-[#757B82] border transition space-y-0 p-[2px] rounded-md">
                    <FormControl>
                      <Input
                        {...field}
                        className="peer px-4 py-4 !border-none !outline-none !ring-0 relative shadow-none rounded-md"
                        placeholder="Password"
                        disabled={signingUser}
                      />
                    </FormControl>
                    <FormLabel
                      className="absolute hidden peer-focus:block left-6 
                      top-0 -translate-y-[70%] bg-white px-[10px]
                      text-lg font-medium text-[#757B82] leading-[26px] pb-0 m-0 "
                    >
                      Password
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                variant="ghost"
                className="btn-1 text-primary w-full"
                disabled={signingUser}
              >
                Forget Password
              </Button>
              <Button
                className="bg-primary text-white btn-1 w-full justify-between items-center"
                type="submit"
                disabled={signingUser}
              >
                Continue
                {signingUser ? (
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                ) : (
                  <ArrowRight className="w-[18px] h-[18px]" />
                )}
              </Button>
              <div className="flex items-center gap-x-3">
                <p>Don’t have an account?</p>
                <Button
                  variant="ghost"
                  className="btn-1 text-primary p-0"
                  disabled={signingUser}
                >
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

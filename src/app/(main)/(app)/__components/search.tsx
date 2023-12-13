'use client';

import { createMessage } from '@/actions/conversations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ClientUser } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useAction } from 'next-safe-action/hook';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TypeOf, object, string } from 'zod';

const formSchema = object({ search: string().min(1) });

type SearchFormData = TypeOf<typeof formSchema>;
export const SearchCard = ({
  hideCover,
  user,
  conversationId,
}: {
  hideCover?: boolean;
  user: ClientUser;
  conversationId?: string;
}) => {
  const form = useForm<SearchFormData>({ resolver: zodResolver(formSchema) });
  const { execute, status } = useAction(createMessage, {
    onError: () => {
      toast.error('Message', { description: 'Message failed to send' });
    },
    onSuccess: () => {
      form.reset();
    },
  });
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-1 mb-10">
        {!hideCover && (
          <div className="relative w-[60px] h-[60px]">
            <Image src="/icons/logo.svg" fill alt="logo" />
          </div>
        )}
      </div>
      {!hideCover && (
        <h1 className="text-[#323343]">Hello, How can we help you?</h1>
      )}
      <div className="mt-8">
        <Form {...form}>
          <form
            className="w-full flex items-center gap-x-5"
            onSubmit={form.handleSubmit(({ search }) => {
              execute({
                message: search,
                userId: user.id,
                conversationId,
                sentTime: new Date(),
              });
            })}
          >
            <FormField
              name="search"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter a condition"
                      className="!border-none !outline-none !ring-0 focus-visible:ring-0  bg-white px-5 py-2 placeholder-shown:text-[#9EA3A7] body-7"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="bg-primary-brand text-white">
              {status === 'executing' ? (
                <Loader2 className="w-[30px] h-[30px] animate-spin" />
              ) : (
                <Search className="w-[30px] h-[30px] " />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

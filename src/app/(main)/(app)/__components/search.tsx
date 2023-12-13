'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

const formSchema = object({ search: string().min(1) });

type SearchFormData = TypeOf<typeof formSchema>;
export const SearchCard = ({ hideCover }: { hideCover?: boolean }) => {
  const form = useForm<SearchFormData>({ resolver: zodResolver(formSchema) });
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-1 mb-10">
        {!hideCover && (
          <div className="relative w-[60px] h-[60px]">
            <Image src="/icons/logo.svg" fill alt="logo" />
          </div>
        )}

   
      </div>
      <h1 className="text-[#323343]">Hello, How can we help you?</h1>
      <div className="mt-8">
        <Form {...form}>
          <form className="w-full flex items-center gap-x-5">
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
              <Search className="w-[30px] h-[30px] " />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ClientUser } from '@/lib/auth';
import { BadgeCheck, BadgeX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UpdateEmalProps {
  user: ClientUser;
}

const changeEmailSchema = object({ email: string().email() });
export const UpdateEmail: React.FC<UpdateEmalProps> = ({
  user: { email, emailVerified },
}) => {
  const form = useForm<TypeOf<typeof changeEmailSchema>>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { email: '' },
  });

  return (
    <div className="w-full shadow-separator py-6">
      <div className="flex gap-x-[118px]">
        <div className="space-y-1">
          <h6 className="font-epilogue font-semibold text-neutral-100">
            Update Email
          </h6>
          <p className="font-epilogue font-normal text-neutral-60">
            Update your email address to make sure it is safe
          </p>
        </div>
        <div className="max-w-[539px] w-full space-y-5">
          <div className="flex flex-col gap-y-1">
            <p className="font-medium text-sm flex gap-x-2 items-center text-neutral-100">
              {email}
              {emailVerified ? (
                <BadgeCheck className="w-6 h-6 text-[#56CDAD]" />
              ) : (
                <BadgeX className="w-6 h-6 text-rose-700" />
              )}
            </p>
            <p className="font-epilogue text-base font-normal text-neutral-60">
              Your email address is{' '}
              {emailVerified ? 'verified' : 'not verified'}.
            </p>
          </div>
          <div>
            <Form {...form}>
              <form className="flex flex-col space-y-5">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your new email"
                          className="placeholder:text-neutral-40 font-medium rounded-none px-4 py-3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  variant="primary"
                  className="self-start  px-6 py-3"
                  type="submit"
                >
                  Update Email
                </Button>
              </form>
            </Form>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

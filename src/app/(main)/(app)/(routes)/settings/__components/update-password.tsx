import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ClientUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { SuccessServerResponsePayload } from '@/lib/response';
import { toast } from 'sonner';

interface ChangePasswordProps {
  user: ClientUser;
}

const changePasswordSchema = object({
  currentPassword: string(),
  newPassword: string(),
});

export const UpdatePasword: React.FC<ChangePasswordProps> = () => {
  const form = useForm<TypeOf<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [serverUpdatingPassword, setServerUpdatingPassword] = useState(false);
  async function onSubmitUpdatePassword(
    formData: TypeOf<typeof changePasswordSchema>
  ) {
    setServerUpdatingPassword(true);
    try {
      const {
        data: { title, message },
      } = await axios.patch<SuccessServerResponsePayload<void>>(
        '/api/auth/change-password',
        formData
      );

      toast.success(title, { description: message });
      form.reset();
    } catch (e) {
      toast.error('Password Update Failed', {
        description: 'An error occurred while updating your password.',
      });
    } finally {
      setServerUpdatingPassword(false);
    }
  }
  return (
    <div className="w-full shadow-separator py-6">
      <div className="flex gap-x-[118px]">
        <div className="space-y-1">
          <h6 className="font-epilogue font-semibold text-neutral-100">
            Update Password
          </h6>
          <p className="font-epilogue font-normal text-neutral-60">
            Update your email address to make sure it is safe
          </p>
        </div>
        <div className="max-w-[539px] w-full">
          <Form {...form}>
            <form
              className="flex flex-col space-y-5"
              onSubmit={form.handleSubmit(onSubmitUpdatePassword)}
            >
              <FormField
                name="currentPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={oldPasswordVisible ? 'text' : 'password'}
                          placeholder="Enter your old password"
                          className="pr-8 placeholder:text-neutral-40  font-medium rounded-none px-4 pl-3"
                          disabled={serverUpdatingPassword}
                        />
                        <span className="absolute  right-2 top-[50%] -translate-y-[50%]">
                          {!oldPasswordVisible ? (
                            <EyeOff
                              className="w-4 h-4 text-slate-500"
                              onClick={() => setOldPasswordVisible(true)}
                            />
                          ) : (
                            <Eye
                              className="w-4 h-4 text-slate-500"
                              onClick={() => setOldPasswordVisible(false)}
                            />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm font-normal text-neutral-60 mt-1">
                      Minimum of 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={newPasswordVisible ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          className="pr-8 placeholder:text-neutral-40  font-medium rounded-none px-4 pl-3"
                          disabled={serverUpdatingPassword}
                        />
                        <span className="absolute  right-2 top-[50%] -translate-y-[50%]">
                          {!newPasswordVisible ? (
                            <EyeOff
                              className="w-4 h-4 text-slate-500"
                              onClick={() => setNewPasswordVisible(true)}
                            />
                          ) : (
                            <Eye
                              className="w-4 h-4 text-slate-500"
                              onClick={() => setNewPasswordVisible(false)}
                            />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm font-normal text-neutral-60 mt-1">
                      Minimum of 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="self-start  px-6 py-3"
                type="submit"
                disabled={serverUpdatingPassword}
              >
                Update Password
              </Button>
            </form>
          </Form>
        </div>
        <div></div>
      </div>
    </div>
  );
};

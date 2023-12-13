import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userGender } from '@/db/schema';
import { ClientUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string, z } from 'zod';

const formSchema = object({
  fullName: string(),
  phoneNo: string(),
  email: string(),
  dateOfBirth: z.date(),
  gender: z.enum(userGender.enumValues).optional(),
});

interface UpdatePersonalDetailsProps {
  user: ClientUser;
  serverSyncProfileUpdate?: boolean;
  saveFormState: (data: TypeOf<typeof formSchema>, isValid: boolean) => void;
}

export const UpdatePersonalDetails: React.FC<UpdatePersonalDetailsProps> = ({
  user,
  serverSyncProfileUpdate,
  saveFormState,
}) => {
  const form = useForm<TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: (user.profile as { fullName: string }).fullName,
      gender: user.profile.gender!,
      dateOfBirth: user.profile.dateOfBirth
        ? new Date(user.profile.dateOfBirth)
        : undefined,
    },
  });

  useEffect(() => {
    saveFormState(form.getValues(), form.formState.isValid);
  }, [form.watch('fullName'), form.watch('dateOfBirth'), form.watch('gender')]);

  return (
    <div className="w-full shadow-separator py-6">
      <div className="flex gap-x-[246px]">
        <div className="space-y-1">
          <h6 className="font-epilogue font-semibold text-neutral-100">
            Personal Details
          </h6>
        </div>
        <div className="max-w-[539px] w-full space-y-5">
          <Form {...form}>
            <form className="grid grid-col-1 lg:grid-cols-2 grid-rows-3 gap-6">
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-full row-span-1">
                    <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        className="placeholder:text-neutral-40 font-medium rounded-none px-4 py-3"
                        disabled={serverSyncProfileUpdate}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="dateOfBirth"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col ">
                    <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                      Date of birth
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        disabled={serverSyncProfileUpdate}
                      >
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal rounded-none px-4 py-3',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: any) =>
                            new Date(date) > new Date() ||
                            date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-epilogue font-semibold text-base text-neutral-80">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={serverSyncProfileUpdate}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-none px-4 py-3">
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

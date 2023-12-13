'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SeekerTabHeaderProps {
  title: string;
  backIcon?: React.ReactNode;
  showBackAction?: boolean;
}

export const SeekerTabHeader: React.FC<SeekerTabHeaderProps> = ({
  title,
  backIcon,
  showBackAction = true,
}) => {
  const router = useRouter();
  return (
    <div className="p-8 w-full shadow-separator">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          {backIcon}
          <h3 className="text-4xl font-semibold font-clash leading-[120%] text-neutral-100">
            {title}
          </h3>
        </div>
        <div>
          <Button
            variant="outline"
            className={cn(
              'text-primary-brand hidden px-6 py-3 btn-md',
              showBackAction && 'block'
            )}
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            Back to homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

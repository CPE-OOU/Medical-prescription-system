import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IconProps {
  src: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ src, className }) => {
  return (
    <span className={cn('relative w-6 h-6 block', className)}>
      <Image src={src} fill alt="icon" />
    </span>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientUser } from '@/lib/auth';
import { FileUploader } from 'react-drag-drop-files';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useMount } from '@/hooks/use-mouted';
import { useAction } from 'next-safe-action/hook';
import { updateProfileImg } from '@/actions/profile';

interface UpdateProfileImageProps {
  user: ClientUser;
  serverSyncProfileUpdate?: boolean;
  saveFormState: (data: { imgUrl?: string }, isValid: boolean) => void;
}
const fileTypes = ['JPG', 'PNG'];

export const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  user,
  serverSyncProfileUpdate,
  saveFormState,
}) => {
  const [uploadingProfileImg, setUploadingProfileImg] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(
    user.profile.profileImgUrl
  );

  const { execute, status } = useAction(updateProfileImg);

  const mounted = useMount();

  if (!mounted) return null;

  const handleChange = async (file: File) => {
    const fileImgUrl = URL.createObjectURL(file);
    setProfileImgUrl(fileImgUrl);
    setUploadingProfileImg(true);
    try {
      const { data } = await supabase.storage
        .from('profiles')
        .upload(`/user/${user.id}/${file.name}`, file, { upsert: true });

      if (!data) {
        return toast.error('Profile image upload Failed', {
          description:
            'We encountered an error while uploading your profile image.',
        });
      }

      const {
        data: { publicUrl: profileImgPath },
      } = supabase.storage.from('profiles').getPublicUrl(data.path);

      execute({ userId: user.id, profileImageUrl: profileImgPath });

      toast.success('Profile image upload completed', {
        description:
          'Your profile image as being uploaded. Save to reflect changes',
      });
    } catch (e) {
      setProfileImgUrl(user.profile.profileImgUrl);
      return toast.error('Profile image upload Failed', {
        description:
          'We encountered an error while uploading your profile image.',
      });
    } finally {
      URL.revokeObjectURL(fileImgUrl);
      setUploadingProfileImg(false);
    }
  };

  return (
    <div className="w-full shadow-separator py-6">
      <div className="flex gap-x-[118px]">
        <div className="space-y-1 max-w-[260px]">
          <h6 className="font-semibold text-neutral-100">Profile Photo</h6>
          <p className="font-normal text-neutral-60">
            This image will be shown publicly as your profile picture
          </p>
        </div>
        <div className="max-w-[539px] w-full flex gap-x-6 items-center">
          <Avatar className="w-32 h-32 rounded-full relative">
            <div
              className={cn(
                'absolute inset-0 bg-slate-200/30 opacity-0',
                uploadingProfileImg && 'opacity-100'
              )}
            >
              <div className="w-full h-full flex items-center justify-center">
                <Loader2
                  className={cn(
                    'w-6 h-6 text-neutral-500',
                    uploadingProfileImg && 'animate-spin'
                  )}
                />
              </div>
            </div>
            <AvatarImage src={profileImgUrl ?? undefined} />
            <AvatarFallback>
              {(user.profile as { fullName: string }).fullName
                .split(/\s+/)
                .map((word) => word[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            hoverTitle=""
            multiple={false}
            disabled={uploadingProfileImg || serverSyncProfileUpdate}
          >
            <div
              className="
          border-dashed 
          border-2
          border-spacing-4
          rounded-sm
          border-primary-brand px-11 py-6
          "
            >
              <div className="flex flex-col items-center">
                <span>Image</span>
                <div className="font-medium text-base text-neutral-80">
                  <span className="hover:bg-transparent text-primary-brand">
                    Click to replace
                  </span>{' '}
                  Or drag and drop
                </div>
                <div className="text-neutral-60 font-epilogue font-medium text-center">
                  SVG, PNG, JPG or GIF (max. 400 x 400px)
                </div>
              </div>
            </div>
          </FileUploader>
        </div>
      </div>
    </div>
  );
};

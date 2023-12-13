import { ClientUser } from '@/lib/auth';
import { UpdateProfileImage } from './update-profile-img';
import { UpdatePersonalDetails } from './personal-details';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MyProfileSettingsProps {
  user: ClientUser;
}

export const MyProfileSettings: React.FC<MyProfileSettingsProps> = ({
  user,
}) => {
  const [userProfileImgState, setUserProfileImgState] = useState<{
    data: { imgUrl?: string };
    errored: boolean;
  }>({
    data: { imgUrl: user.profile.fullName ?? undefined },
    errored: false,
  });

  const [personalDetailState, setPersonDetailState] = useState<{
    data: {
      email: string | null;
      fullName: string;
      dateOfBirth?: Date | null;
      phoneNo?: string;
      gender?: 'male' | 'female' | null;
    };
    errored: boolean;
  }>({
    data: {
      email: user.email,
      fullName: user.profile.fullName!,
      dateOfBirth:
        (user.profile.dateOfBirth && new Date(user.profile.dateOfBirth)) ||
        null,
      gender: user.profile.gender!,
    },
    errored: false,
  });

  const formNotValid =
    personalDetailState.errored || userProfileImgState.errored;

  const router = useRouter();

  return (
    <div className="w-full">
      <div className="shadow-separator py-6">
        <div className="space-y-1">
          <h6 className="text-neutral-100 font-normal font-epilogue text-lg ">
            Basic Information
          </h6>
          <p className="text-neutral-60 font-epilogue font-normal  text-base">
            This is login information that you can update anytime.
          </p>
        </div>
      </div>
      <UpdateProfileImage
        user={user}
        serverSyncProfileUpdate={false}
        saveFormState={(data, errored) =>
          setUserProfileImgState({ data, errored })
        }
      />
      <UpdatePersonalDetails
        user={user}
        serverSyncProfileUpdate={false}
        saveFormState={(data, errored) =>
          setPersonDetailState({ data: data, errored })
        }
      />

      <div className="pt-6 pb-12">
        <Button
          className="ml-auto flex items-center gap-x-2 0 font-semibold text-base rounded-none"
          disabled={formNotValid}
          type="button"
          onClick={() => {}}
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
};

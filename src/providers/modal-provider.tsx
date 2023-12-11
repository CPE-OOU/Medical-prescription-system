import { EditAboutMeModal } from '@/components/modals/edit-about-modal';
import { EditAdditionalDetailsModal } from '@/components/modals/edit-additional-modal';
import { EditProfileModal } from '@/components/modals/edit-profile-modal';
import { EditSocialLinks } from '@/components/modals/edit-social-modal';
import { EducationQualificationModal } from '@/components/modals/education-modal';
import { ExperienceFormModal } from '@/components/modals/experience-modal';
import { OrganizationBenefitsModal } from '@/components/modals/organization/organization-benefit-modal';
import { OrganizationAboutMeModal } from '@/components/modals/organization/organization-edit-about-me';
import { OrganizationEditCountriesModal } from '@/components/modals/organization/organization-edit-countries-modal';
import { OrganizationEditSocialLinksModal } from '@/components/modals/organization/organization-edit-social-modal';
import { OrganizationGalleryUploadModal } from '@/components/modals/organization/organization-gallery-upload';
import { CreateSkillModals } from '@/components/modals/skill-modal';
import { useMount } from '@/hooks/use-mouted';

export const ModalProvider = () => {
  const mounted = useMount();

  if (!mounted) return null;

  return (
    <>
      <EditProfileModal />
      <EditSocialLinks />
      <EditAdditionalDetailsModal />
      <EditAboutMeModal />
      <ExperienceFormModal />
      <EducationQualificationModal />
      <CreateSkillModals />
      <OrganizationAboutMeModal />
      <OrganizationBenefitsModal />
      <OrganizationEditSocialLinksModal />
      <OrganizationEditCountriesModal />
      <OrganizationGalleryUploadModal />
    </>
  );
};

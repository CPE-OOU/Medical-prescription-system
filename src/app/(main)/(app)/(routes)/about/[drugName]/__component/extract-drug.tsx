'use client';
import { webScrapeDrugContent } from '@/lib/extract-drug';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ExtractDrugDisplay = ({
  drugs,
}: {
  drugs: NonNullable<Awaited<ReturnType<typeof webScrapeDrugContent>>>;
}) => {
  const router = useRouter();
  return (
    <div className="px-8 py-6 bg-white">
      <span onClick={() => router.back()} className="mb-12 inline-block">
        <MoveLeft className="w-6 h-6 text-[#141B34]" />
      </span>

      <div className="space-y-[40px]">
        <div>
          <h2 className="font-semibold text-5xl leading-[45px] text-[#141B34] space-y-6">
            {drugs.drugTitle}
          </h2>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.aboutDrug}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Drug Warnings
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.warnings}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Before Takings
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.beforeTaking}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Dosage
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.dosage}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Miss Dosage
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.missDosage}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Miss Dosage
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drugs.overDosage}
          </p>
        </div>
      </div>
    </div>
  );
};

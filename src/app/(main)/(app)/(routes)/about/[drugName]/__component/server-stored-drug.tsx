import { Drug } from '@/db/schema';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ServerStoreDrug = ({ drug }: { drug: Drug }) => {
  const router = useRouter();
  return (
    <div className="px-8 py-6 bg-white ">
      <span onClick={() => router.back()} className="inline-block mb-12">
        <MoveLeft className="w-6 h-6 text-[#141B34]" />
      </span>

      <div></div>

      <div className="space-y-[40px]">
        <div>
          <h2 className="font-semibold text-5xl leading-[45px] text-[#141B34]">
            {drug.name}
          </h2>
          <p className="">{drug.decription}</p>
        </div>

        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Side Effects
          </h4>
          <ul className="space-y-2">
            {drug.effects?.map((effect) => (
              <li
                className="text-lg text-[#323343] leading-[28px]"
                key={effect}
              >
                {effect}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Uses
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drug.uses?.map((use) => (
              <li className="text-lg text-[#323343] leading-[28px]" key={use}>
                {use}
              </li>
            ))}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-[32px] leading-[45px] text-[#141B34] space-y-6">
            Dosage
          </h4>
          <p className="text-lg text-[#323343] leading-[28px]">
            {drug.relatedDrugs?.map(({ drugName }) => (
              <li
                className="text-lg text-[#323343] leading-[28px]"
                key={drugName}
              >
                {drugName}
              </li>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

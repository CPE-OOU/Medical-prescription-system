import { getCurrentUser } from '@/lib/auth';
import { webScrapeDrugContent } from '@/lib/extract-drug';
import { notFound, redirect } from 'next/navigation';
import { ExtractDrugDisplay } from './__component/extract-drug';
import { drugs } from '@/db/schema';
import { eq, ilike } from 'drizzle-orm';
import { ServerStoreDrug } from './__component/server-stored-drug';
import { db } from '@/db/init';

export default async function AboutDrugPage({
  params,
}: {
  params: { drugName: string };
}) {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-in');

  const { drugName } = params;

  const [drug] = await db
    .select()
    .from(drugs)
    .where(ilike(drugs.name, drugName));

  const drugInfo = await webScrapeDrugContent(drugName);

  if (drugInfo) {
    return (
      <div className="bg-[#f5f5f5] px-6 py-[21px]">
        <ExtractDrugDisplay drugs={drugInfo!} />
      </div>
    );
  }

  if (!drug) {
    return notFound();
  }

  return (
    <div className="bg-[#f5f5f5] px-6 py-[21px]">
      <ServerStoreDrug drug={drug} />;
    </div>
  );
}

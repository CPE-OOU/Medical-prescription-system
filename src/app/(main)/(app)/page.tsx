import { SearchCard } from './__components/search';

export const dynamic = 'force-dynamic';
export default function MainPage() {
  return (
    <div className="w-full h-full grid place-content-center">
      <SearchCard />
    </div>
  );
}

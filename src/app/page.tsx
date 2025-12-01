import './_app/home';
import Populate from './_app/home';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';
import { getSession } from './_services/auth';
import { CategoryIndex } from './_components/category-index';
import { JsonWebToken } from './_data/types';

export default async function Home() {

  let user = await getSession();
  // if (!user) redirect('/login', RedirectType.replace);
  if (!user) user = { userName: "Distri" }
  const app = await Populate(user.userName);

  return (
    <div>
      <CategoryIndex user={user.userName} />
      <script src="index.js" defer></script>
      {app ? app : "Did Not Mount"}
    </div>
  );
}

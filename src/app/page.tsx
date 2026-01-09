import './_app/home';
import Populate from './_app/home';
import Image from 'next/image';
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
      <nav id="navbar" className="side-menu hidden">
        <h2 id="close-menu">X</h2>
        <ul className="side-menu-list">
          <li className="side-menu-item"><a href="#almacen-1">Almacén</a></li>
          <li className="side-menu-item"><a href="#bebidas-1">Bebidas</a></li>
          <li className="side-menu-item"><a href="#cafe-1">Café</a></li>
          <li className="side-menu-item"><a href="#edulcorantes-1">Edulcorantes</a></li>
          <li className="side-menu-item"><a href="#galletitas-1">Galletitas</a></li>
          <li className="side-menu-item"><a href="#medicamentos-1">Medicamentos</a></li>
          <li className="side-menu-item"><a href="#nucete-1">Nucete</a></li>
          <li className="side-menu-item"><a href="#kiosco-1">Kiosco</a></li>
          <li className="side-menu-item"><a href="#make-1">Make</a></li>
          <li className="side-menu-item"><a href="#varios-1">Varios</a></li>
          <li className="side-menu-item"><a href="#te-1">Té</a></li>
          <li className="side-menu-item"><a href="#yerba-1">Yerba</a></li>
          <li className="side-menu-item"><a href="#promocion-1">Promocion</a></li>
        </ul>
      </nav>
      <h2 id="menu-toggle" className="no-print menu-toggle">Menu</h2>
    </div>
  );
}

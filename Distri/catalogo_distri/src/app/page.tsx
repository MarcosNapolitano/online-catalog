import './_app/home';
import Populate from './_app/home';
import Image from 'next/image';
import backgroundImage from '@/../public/img/back.webp'

export default async function Home() {

  const app = await Populate();

  return (
    <div>
      <script src="index.js" defer></script>
      <section id="0" className="section" style={{ backgroundImage: `url(${backgroundImage.src})`, minHeight: "100dvh" }}>
        <div className="svg section-header index">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
          </svg>
          <h2 className='header index-header' >Elija la categoría deseada</h2>
          <Image className="logo index-logo" alt="logo" src="/img/logo.png" height={100} width={250} />
        </div>
        <div className='index-categories'>
          <ul className='index-list-container'>
            <li className="index-category header-almacen"><a href="#almacen-1">Almacén</a></li>
            <li className="index-category header-bebidas"><a href="#bebidas-1">Bebidas</a></li>
            <li className="index-category header-cafe"><a href="#cafe-1">Café</a></li>
            <li className="index-category header-edulcorantes"><a href="#edulcorantes-1">Edulcorantes</a></li>
            <li className="index-category header-galletitas"><a href="#galletitas-1">Galletitas</a></li>
            <li className="index-category header-medicamentos"><a href="#medicamentos-1">Medicamentos</a></li>
            <li className="index-category header-higiene"><a href="#higiene-1">Higiene</a></li>
          </ul>
          <ul className='index-list-container'>
            <li className="index-category header-nucete"><a href="#nucete-1">Nucete</a></li>
            <li className="index-category header-kiosco"><a href="#kiosco-1">Kiosco</a></li>
            <li className="index-category header-limpieza"><a href="#limpieza-1">Limpieza</a></li>
            <li className="index-category header-varios"><a href="#varios-1">Varios</a></li>
            <li className="index-category header-te"><a href="#te-1">Té</a></li>
            <li className="index-category header-yerba"><a href="#yerba-1">Yerba</a></li>
            <li className="index-category header-promocion"><a href="#promocion-1">Promocion</a></li>
          </ul>
        </div>
        <div className="svg section-footer">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
          </svg>
          <footer className="footer"><a className="footer-link">llame aquí</a></footer>
        </div>
      </section>
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
          <li className="side-menu-item"><a href="#limpieza-1">Limpieza</a></li>
          <li className="side-menu-item"><a href="#varios-1">Varios</a></li>
          <li className="side-menu-item"><a href="#te-1">Té</a></li>
          <li className="side-menu-item"><a href="#yerba-1">Yerba</a></li>
          <li className="side-menu-item"><a href="#promocion-1">Promocion</a></li>
        </ul>
      </nav>
      <h2 id="menu-toggle" className="menu-toggle">Menu</h2>
    </div>
  );
}

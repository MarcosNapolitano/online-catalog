import './_app/home';
import Populate from './_app/home';
export default async function Home() {

    const app = await Populate();

    return (
        <div>
            <script src="index.js" defer></script>
            {app ? app : "Did Not Mount"}
            <nav id="navbar" className="side-menu hidden">
                <h2 id="close-menu">X</h2>
                <ul className="side-menu-list">
                    <li className="side-menu-item"><a href="#almacen-7">Almacén</a></li>
                    <li className="side-menu-item"><a href="#bebidas-1">Bebidas</a></li>
                    <li className="side-menu-item"><a href="#cafe-1">Café</a></li>
                    <li className="side-menu-item"><a href="#edulcorantes-1">Edulcorantes</a></li>
                    <li className="side-menu-item"><a href="#galletitas-1">Galletitas</a></li>
                    <li className="side-menu-item"><a href="#medicamentos-1">Medicamentos</a></li>
                    <li className="side-menu-item"><a href="#nucete-15">Nucete</a></li>
                    <li className="side-menu-item"><a href="#kiosko-1">Kiosco</a></li>
                    <li className="side-menu-item"><a href="#limpieza-1">Limpieza</a></li>
                    <li className="side-menu-item"><a href="#varios-1">Varios</a></li>
                    <li className="side-menu-item"><a href="#te-1">Té</a></li>
                    <li className="side-menu-item"><a href="#yerba-1">Yerba</a></li>
                    <li className="side-menu-item"><a href="#promocion">Promocion</a></li>
                </ul>
            </nav>
            <h2 id="menu-toggle" className="menu-toggle">Menu</h2> 
        </div>
    );
}

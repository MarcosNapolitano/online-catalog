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
                    <li className="side-menu-item"><a href="#almacen">Almacén</a></li>
                    <li className="side-menu-item"><a href="#bebidas">Bebidas</a></li>
                    <li className="side-menu-item"><a href="#cafe">Café</a></li>
                    <li className="side-menu-item"><a href="#edulcorantes">Edulcorantes</a></li>
                    <li className="side-menu-item"><a href="#galletitas">Galletitas</a></li>
                    <li className="side-menu-item"><a href="#medicamentos">Medicamentos</a></li>
                    <li className="side-menu-item"><a href="#nucete">Nucete</a></li>
                    <li className="side-menu-item"><a href="#kiosco">Kiosco</a></li>
                    <li className="side-menu-item"><a href="#limpieza">Limpieza</a></li>
                    <li className="side-menu-item"><a href="#varios">Varios</a></li>
                    <li className="side-menu-item"><a href="#te">Té</a></li>
                    <li className="side-menu-item"><a href="#yerba">Yerba</a></li>
                    <li className="side-menu-item"><a href="#promocion">Promocion</a></li>
                </ul>
            </nav>
            <h2 id="menu-toggle" className="menu-toggle">Menu</h2> 
        </div>
    );
}

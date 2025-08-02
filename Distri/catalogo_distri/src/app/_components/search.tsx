'use client'
import React from 'react';
import { useState } from 'react';
import { data } from '../_app/home';

export const Search: React.FC = (): React.JSX.Element => {

    const [searchString, setSearchString] = useState<string>("");

    return (
        <div>
            <select id="pet-select" onChange={a => console.log("hola")}>
                <option value="">--elegí categoría--</option>
                <option value="almacen">Almacén</option>
                <option value="bebidas">Bebidas</option>
                <option value="cafe">Café</option>
                <option value="edulcorantes">Edulcorantes</option>
                <option value="galletitas">Galletitas</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="nucete">Nucete</option>
                <option value="kiosko">Kiosko</option>
                <option value="limpieza">Limpieza</option>
                <option value="varios">Varios</option>
                <option value="te">Té</option>
                <option value="yerba">Yerba</option>
                <option value="promocion">Promoción</option>
            </select>
            <input type='search' onChange={ e => setSearchString(e.target.value) }/>
            <p>{searchString}</p>
        </div>
    );
};

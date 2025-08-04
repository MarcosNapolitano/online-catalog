'use client'
import React from 'react';
import { useState } from 'react';
import { IProduct } from '../_data/data';
import Link from 'next/link';

interface Search{
  data: IProduct | undefined;
}

interface ResultList{
  data: IProduct[] | void;
  filter: string;
  category: string;
}

const ResultList: React.FC<ResultList> = ( { data, filter, category } ): React.JSX.Element => {

    if (!data) return <li>No results found </li>;

    const retElement = data.filter(a => a.section === category )
                           .filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
                           .map((a) =>{ return <li key={a.sku}><Link href={"/admin/"+a.sku}>{a.name}</Link></li> });

    return (<ul>{retElement}</ul>);
};

export const Search: React.FC<Search> = ( { data } ): React.JSX.Element => {

    const [searchString, setSearchString] = useState<string>("");
    const [searchCat, setSearchCat] = useState<string>("");

    return (
        <div>
            <select id="pet-select" onChange={(e) => {

                document.getElementById("inputBar")?.removeAttribute("disabled");
                document.getElementById("first-option")?.setAttribute("disabled", "true");
                setSearchCat(e.target.value);
            }}>
                <option id="first-option" value="">--elegí categoría--</option>
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

            <input  id="inputBar" disabled type='search' 
                    onChange={ e => setSearchString(e.target.value) } 
                    placeholder='seleccioná categoría primero...'/>

            <p>{data ? `Resultados para "${searchString}"` : "Could not Fetch Products"}</p>

            <ResultList data={data} category={searchCat} filter={searchString} />
        </div>
    );
};

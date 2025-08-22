'use client'
import React, { useState } from 'react';
import { IProduct } from '../_data/data';
import Link from 'next/link';

interface Search {
  data: IProduct[] | undefined;
  backAction: (sku: string) => Promise<true | false>;
}

interface ResultList {
  data: IProduct[] | void;
  filter: string;
  category?: string;
  backAction: (sku: string) => Promise<true | false>;
}

interface Result {
  sku: string;
  active: boolean;
  name: string;
  orden: number;
  backAction: (sku: string) => Promise<true | false>;
}

const Result: React.FC<Result> = ({ sku, orden, active, name, backAction }): React.JSX.Element => {

  const [productStatus, setProductStatus] = useState<true | false>(active);
  const [checkStatus, setCheckStatus] = useState<true | false> (false);

  const handleChange = async () => { 
    setProductStatus(!productStatus); 

    setCheckStatus(true); 

    // if we could not toggle element, we return to the previous pending state
    if (!await backAction(sku)) return setProductStatus(pending => !pending);

    setCheckStatus(false); 

  };

  return <li key={sku}>
            <Link href={"/admin/" + sku}>
              {`${orden.toString()} - ${name}`}
            </Link>
            <input disabled={checkStatus} type='checkbox' onClick={handleChange} defaultChecked={active}/>
         </li>

};

const ResultList: React.FC<ResultList> = ({ data, filter, category, backAction }): React.JSX.Element => {

  if (!data) return <li>No results found </li>;

  const retElement = data
    .filter(a => category ? a.section === category : a)
    .filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))
    .map((a) => <Result key={a.sku} sku={a.sku} orden={a.orden} name={a.name} active={a.active} backAction={backAction} />);

  return (<ul>{retElement}</ul>);
};

export const Search: React.FC<Search> = ({ data, backAction }): React.JSX.Element => {

  const [searchString, setSearchString] = useState<string>("");
  const [searchCat, setSearchCat] = useState<string>("");

  return (
    <div>
      <select id="cat-select" onChange={(e) => {

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
        <option value="kiosco">Kiosko</option>
        <option value="limpieza">Limpieza</option>
        <option value="higiene">Higiene</option>
        <option value="varios">Varios</option>
        <option value="te">Té</option>
        <option value="yerba">Yerba</option>
        <option value="promocion">Promoción</option>
      </select>

      <input id="inputBar" type='search'
        onChange={e => setSearchString(e.target.value)}
        placeholder='seleccioná categoría primero...' />

      <p>{data ? `Resultados para "${searchString}"` : "Could not Fetch Products"}</p>

      <ResultList data={data} category={searchCat} filter={searchString} backAction={backAction} />
    </div>
  );
};

'use client'
import React, { useState } from 'react';
import { type IProduct } from '@/app/_data/types';
import { type SearchComp } from '@/app/_data/types';
import { type ResultList } from '@/app/_data/types';
import { type Result } from '@/app/_data/types';
import Link from 'next/link';

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

const ResultList: React.FC<ResultList> = ({ products, filter, category, backAction }): React.JSX.Element => {

  const [limit, setLimit] = useState([0, 10]);
  if (!products) return <li>No results found </li>;

  products = products
    .filter(a => category ? a.section === category : a)
    .filter(a => a.name.toLowerCase().includes(filter.toLowerCase()))

  const retElement = products
    .filter((element: IProduct, index: number) => limit[0] <= index && index < limit[1])
    .map((a) => <Result key={a.sku} sku={a.sku} orden={a.orden} name={a.name} active={a.active} backAction={backAction} />);

  const pages: React.JSX.Element[] = new Array(Math.ceil(products.length/10));

  const handleClick = (e: React.MouseEvent) => {

    const newLimit = parseInt(e.currentTarget.id);

    if(newLimit === limit[1]) return;
    setLimit([newLimit - 10, newLimit]);
  }

  let counter: number = 10;

  for (let i = 0; i < pages.length; i++) {
    
    pages[i] = <p key={counter} id={counter.toString()} className='pageLink'
    onClick={(a) => handleClick(a)}>
    { i ? <span>- </span> : <span></span>}{i + 1}&nbsp;</p>
    counter += 10;
    
  } 

  return <div>
    <ul>{retElement}</ul>
    <br />
    <div className='links'>
      {pages}
    </div>
  </div>
};

export const Search: React.FC<SearchComp> = ({ products, backAction }): React.JSX.Element => {

  const [searchString, setSearchString] = useState<string>("");
  const [searchCat, setSearchCat] = useState<string>("kiosco");

  return (
    <div>
      <select id="cat-select" defaultValue="kiosco" onChange={(e) => {

        setSearchCat(e.target.value);
      }}>
        <option id="first-option"value="">--elegí categoría--</option>
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

      <p>{products ? `Resultados para "${searchString}"` : "Could not Fetch Products"}</p>

      <ResultList products={products} category={searchCat} filter={searchString} backAction={backAction} />
    </div>
  );
};

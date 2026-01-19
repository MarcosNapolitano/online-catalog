'use client'
import React, { use, useEffect, useRef, useState } from 'react';
import { type IProduct } from '@/app/_data/types';
import { type SearchComp } from '@/app/_data/types';
import { type ResultList } from '@/app/_data/types';
import { type Result } from '@/app/_data/types';
import Link from 'next/link';
import { profile } from 'node:console';

const Result: React.FC<Result> = ({ sku, orden, active, name, backAction }): React.JSX.Element => {

  const [productStatus, setProductStatus] = useState<true | false | undefined>(active);
  const [checkStatus, setCheckStatus] = useState<true | false>(false);

  if (productStatus === undefined) return <li className='product-result'>&nbsp;</li>;

  const handleChange = async () => {
    setProductStatus(!productStatus);

    setCheckStatus(true);

    // if we could not toggle element, we return to the previous pending state
    if (!await backAction(sku)) return setProductStatus(pending => !pending);

    setCheckStatus(false);

  };

  return <li className="product-result" key={sku}>
    <Link href={"/admin/" + sku}>
      {`${orden.toString()} - ${name}`}
    </Link>
    <input disabled={checkStatus} type='checkbox' onClick={handleChange} defaultChecked={active} />
  </li>

};

const ResultList: React.FC<ResultList> = ({
  products,
  filter,
  category,
  backAction
}): React.JSX.Element => {

  const RESULT_LIMIT = 25;
  const activePage = useRef<HTMLParagraphElement>(null);
  const [limitArray, setLimit] = useState([0, RESULT_LIMIT]);

  useEffect(() => {
    setLimit([0, RESULT_LIMIT]);
    if(activePage.current) 
      activePage.current.classList.remove("pageLink-active")
  }, [filter])

  if (!products) return <li>No results found </li>;

  products = products
    .filter(product => category ? product.section === category : product)
    .filter(product => product.name.toLowerCase().includes(filter.toLowerCase()))

  const retElement = products
    .filter((element: IProduct, index: number) => limitArray[0] <= index && index < limitArray[1])
    .map((product) =>
      <Result
        key={product.sku}
        sku={product.sku}
        orden={product.orden}
        name={product.name}
        active={product.active}
        backAction={backAction}
      />
    );

  // keep result list with same height
  while (retElement.length < RESULT_LIMIT - 1) {

    retElement.push(
      <Result
        key={retElement.length}
        sku=""
        orden={0}
        name=""
        active={undefined}
        backAction={backAction}
      />)
  }

  const pages: React.JSX.Element[] = new Array(Math.ceil(products.length / RESULT_LIMIT));

  const handleClick = (e: React.MouseEvent) => {

    const newLimit = parseInt(e.currentTarget.id);
    if (newLimit === limitArray[1]) return;

    if(activePage.current) 
      activePage.current.classList.remove("pageLink-active")

    activePage.current = e.currentTarget as HTMLParagraphElement
    activePage.current.classList.add("pageLink-active")

    setLimit([newLimit - RESULT_LIMIT, newLimit]);
  }

  let linkId: number = RESULT_LIMIT;

  for (let i = 0; i < pages.length; i++) {

    pages[i] = <p
      key={linkId}
      id={linkId.toString()}
      className='pageLink'
      onClick={(a) => handleClick(a)}
    >
      {i ? <span className='pageLink'>- </span> : <span></span>}{i + 1}&nbsp;
    </p>

    linkId += RESULT_LIMIT;
  }

  return <div className='result-list'>
    <ul>{retElement}</ul>
    <br />
    <div className='links'>
      {pages}
    </div>
  </div>
};

export const Search: React.FC<SearchComp> = ({ products, backAction }): React.JSX.Element => {

  const [searchString, setSearchString] = useState<string>("");
  const [resetPage, setResetPage] = useState<0>(0);
  const [searchCat, setSearchCat] = useState<string>("kiosco");
  const inputRef = useRef<HTMLInputElement>(null);
  const productsList = use(products);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className='search-panel' >
      <div className='admin-category'>
        <h3>Búsqueda</h3>
        <input id="inputBar" type='search'
          ref={inputRef}
          onChange={e => {
            setResetPage(0)
            setSearchString(e.target.value)
          }}
          placeholder='seleccioná categoría primero...' />
      </div>

      <div className='admin-category'>
        <h3>Categoría</h3>
        <select id="cat-select" defaultValue="kiosco" onChange={(e) => {

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
          <option value="make">Make</option>
          <option value="higiene">Higiene</option>
          <option value="varios">Varios</option>
          <option value="te">Té</option>
          <option value="yerba">Yerba</option>
          <option value="promocion">Promoción</option>
        </select>
      </div>

      <p style={{ marginBottom: "2%" }}>{
        productsList ?
          `Resultados para "${searchString}"` :
          "Could not Fetch Products"}
      </p>

      <ResultList products={productsList}
        category={searchCat}
        filter={searchString}
        backAction={backAction} />
    </div >
  );
};

import React, { createElement, ReactNode } from 'react';
import { type IProductComp } from "@/app/_data/types"
import { type ISection } from "@/app/_data/types"
import { type IColumn } from "@/app/_data/types"
import { type IRow } from "@/app/_data/types"
import { type IProduct } from '@/app/_data/types';
import { readData } from "@/app/_services/json_utils";
import { findProducts } from "@/app/_services/product_utils";
import { Section } from "@/app/_components/section";
import { Row } from "@/app/_components/row";
import { Column } from "@/app/_components/column";
import { Product } from "@/app/_components/product";
import { EmptyProduct } from "@/app/_components/empty-product";
import { unstable_cacheTag as cacheTag } from "next/cache";


/** Creates element pushes it into it's array and clears child's array*/
function createPushAndEmpty(

  comp: React.FC<IColumn> | React.FC<IRow> | React.FC<ISection>,
  childArr: Array<ReactNode>,
  compArr: Array<ReactNode>,
  props: {
    id: string,
    key?: string,
    name?: string,
    section?: string
    user?: string
  }

): void {

  props["key"] = `${props.name}-${props.id}`;

  //New Array since we then erase the original one, we do not
  //want to erase the references too, since they are still
  //used even after creating the element
  const col = createElement(comp, props, new Array(...childArr));

  compArr.push(col);

  //resets the array
  childArr.length = 0;

};

const fetchData = async (): Promise<IProduct[]> => {
  'use cache'
  cacheTag('catalog')
  const products = await findProducts();
  return products?.length ? products : [];
};

//Main function responsible for populating the catalog
export default async function Populate(userName: string): Promise<ReactNode[] | void> {

  const products = await fetchData();

  if (!products.length) return console.error("can't load home BBDD not fetched");

  //Components collecting arrays to be passed as children
  //to React.createElement
  const rowPlaceholder: ReactNode[] = [];
  const columnPlaceholder: ReactNode[] = [];
  const productPlaceholder: ReactNode[] = [];
  const sectionPlaceholder: ReactNode[] = [];

  const URL = `${process.env.CDN_URL}/${process.env.CDN_HASH}`
  const PLACEHOLDER = '7573ba21683f3d6edca8e0641336e9a7323bba6d621fb82ebc5823ddeaf03ea3'
  const OFERTA = 'fe699cef9fda6fcbe461f7c604a9518fca4624b3f1e53c2659dfe728662aee88'
  const NOVEDAD = '20f98cbc8022cb249589a12a16e97ef02f4c833a361fe3e34a160669aaf6d46a'

  //These counter basically indicate pagination
  //for every 2 products there is 1 column
  //for every 3 columns there is 1 row
  //for every 6 columns (initially) there is 1 section
  let colCounter: number = 0;
  let rowCounter: number = 0;
  let sectionCounter: number = 0;
  let actualSection: string = "";

  /** Creates blanks columns in order to fill an incomplete row */
  function createEmptyColumn(): void {

    colCounter++;

    const prod0 = createElement(EmptyProduct,
      {
        id: "0",
        key: "0",
        section: actualSection,
        url: `${URL}/${PLACEHOLDER}/public`
      }
    );

    const prod1 = createElement(EmptyProduct,
      {
        id: "1",
        key: "1",
        section: actualSection,
        url: `${URL}/${PLACEHOLDER}/public`
      }
    );

    productPlaceholder.push(prod0);
    productPlaceholder.push(prod1);

    createPushAndEmpty(Column, productPlaceholder, columnPlaceholder,
      {
        id: colCounter.toString(),
        key: colCounter.toString(),
        section: actualSection
      });
  };

  /** Empties remainder elements in placeholders */
  function emptyRemainder(): void {

    //if there are not any elements left we already emptied the remainders
    if (!productPlaceholder[0] && !columnPlaceholder[0] && !rowPlaceholder[0]) return;

    //first section completes the currently incomplete row
    if (productPlaceholder.length == 1) {

      colCounter++;

      const prod = createElement(EmptyProduct,
        {
          id: "1",
          key: "1",
          section: actualSection,
          url: `${URL}/${PLACEHOLDER}/public`
        }
      );

      productPlaceholder.push(prod);

      createPushAndEmpty(Column, productPlaceholder, columnPlaceholder,
        {
          id: colCounter.toString(),
          key: colCounter.toString(),
          section: actualSection
        });

    };

    while (colCounter < 3) { createEmptyColumn(); };

    rowCounter++;
    colCounter = 0;

    createPushAndEmpty(Row, columnPlaceholder, rowPlaceholder,
      {
        id: rowCounter.toString(),
        key: rowCounter.toString()
      });

    //now that we don't have any more incomplete rows, we create enough
    //of them to fill the current section "whitespace"
    while (rowCounter < 5) {

      rowCounter++;

      while (colCounter < 3) { createEmptyColumn(); };

      colCounter = 0;

      createPushAndEmpty(Row, columnPlaceholder, rowPlaceholder,
        {
          id: rowCounter.toString(),
          key: rowCounter.toString()
        });

    };

    sectionCounter++;
    createPushAndEmpty(Section, rowPlaceholder, sectionPlaceholder,
      {
        id: sectionCounter.toString(),
        key: sectionCounter.toString(),
        name: actualSection,
        user: userName
      });

    rowCounter = 0;

  };

  // Main func starts here
  for (let i = 0; i < products.length; i++) {

    //we define the first section
    if (!actualSection) actualSection = products[i].section;

    //if sections mismatch between products, that means a new section
    else if (actualSection != products[i].section) {

      emptyRemainder();

      actualSection = products[i].section;
      sectionCounter = 0;
    }


    const price = products[i].active ? (
      userName === "gianfranco" ?
        products[i].price :
        products[i].price2
    ) : "Sin Stock"

    let subProductPrice;

    if (products[i].subProduct) {

      subProductPrice = userName === "gianfranco" ?
        products[i].subProduct?.price :
        products[i].subProduct?.price2
    }


    //We Create the elements and we push them into arrays
    //until they hold the right amount to be pushed onto their parents
    //we do this kind of recursively, base case being the end of the JSON
    const prod = createElement(Product,

      {
        id: products[i].sku,
        key: products[i].sku,
        title: products[i].name,
        section: actualSection,
        price: price as string,
        url: {
          url: `${URL}/${products[i].url}/public`,
          oferta: `${URL}/${OFERTA}/public`,
          novedad: `${URL}/${NOVEDAD}/public`
        },
        active: products[i].active,
        special: products[i].special,
        price2: subProductPrice as string
      });

    productPlaceholder.push(prod);

    //Each time we make two products, we add them to a column and so on
    if (products[i].orden % 2 == 0) {
      colCounter++;
      createPushAndEmpty(Column, productPlaceholder, columnPlaceholder,
        {
          id: colCounter.toString(),
          key: colCounter.toString(),
          section: actualSection
        });
    };

    if (colCounter == 3) {
      rowCounter++;
      colCounter = 0;
      createPushAndEmpty(Row, columnPlaceholder, rowPlaceholder,
        {
          id: rowCounter.toString(),
          key: rowCounter.toString()
        });
    };

    if ((rowCounter == 4 && sectionCounter == 0) || rowCounter == 5) {
      sectionCounter++;
      rowCounter = 0;
      createPushAndEmpty(Section, rowPlaceholder, sectionPlaceholder,
        {
          id: sectionCounter.toString(),
          key: sectionCounter.toString(),
          name: actualSection,
          user: userName
        });
    };
  };

  //When we reached the last element, if we still have components, we push them
  emptyRemainder();

  return sectionPlaceholder;
};

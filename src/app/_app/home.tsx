import React, { createElement, ReactNode } from 'react';
import { type IProductComp } from "@/app/_data/types"
import { type ISection } from "@/app/_data/types"
import { type IColumn } from "@/app/_data/types"
import { type IRow } from "@/app/_data/types"
import { type IProduct } from '@/app/_data/types';
import { readData, readFromJson } from "@/app/_services/json_utils";
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

const fetchData = async (): Promise<IProduct[]> =>{
  'use cache'
  cacheTag('catalog')
  return await readData();

}

//Main function responsible for populating the catalog
export default async function Populate(userName: string): Promise<ReactNode[] | void> {

  const products = await fetchData();

  if (!products) return console.error("can't load home BBDD not fetched");

  //Components collecting arrays to be passed as children
  //to React.createElement
  const rowPlaceholder: ReactNode[] = [];
  const columnPlaceholder: ReactNode[] = [];
  const productPlaceholder: ReactNode[] = [];
  const sectionPlaceholder: ReactNode[] = [];

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

    const prod0 = createElement(EmptyProduct, { id: "0", key: "0", section: actualSection });
    const prod1 = createElement(EmptyProduct, { id: "1", key: "1", section: actualSection });

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

      const prod = createElement(EmptyProduct, { id: "1", key: "1", section: actualSection });
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

    // workaround for Decimal128 type
    const price = products[i].active ?
      ((userName === "gianfranco" ? products[i].price : products[i].price2) as unknown as { $numberDecimal: string })
        .$numberDecimal as string :
      "Sin Stock";


    //We Create the elements and we push them into arrays
    //until they hold the right amount to be pushed onto their parents
    //we do this kind of recursively, base case being the end of the JSON
    const prod = createElement(Product,
      {
        id: products[i].sku,
        key: products[i].sku,
        title: products[i].name,
        section: actualSection,
        price: price,
        url: products[i].url,
        active: products[i].active,
        special: products[i].special
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

import React, { createElement, ReactNode } from 'react';
import { readFromJson } from "@/app/_data/utils";
import { Section, ISection } from "@/app/_components/section";
import { Row, IRow } from "@/app/_components/row";
import { Column, IColumn } from "@/app/_components/column";
import Product from "@/app/_components/product";
import { IProduct } from '@/app/_data/data';
import { EmptyProduct } from "@/app/_components/empty-product";

export let data: Array<IProduct> | void;

/** Creates element pushes it into it's array and clears child's array*/
function createPushAndEmpty(comp: React.FC<IColumn | IRow | ISection>, 
                            props: {id: string, key?: string, name?: string, section?: string},
                            childArr: Array<ReactNode>, 
                            compArr: Array<ReactNode>){

    props["key"] = `${props.name}-${props.id}`;

    //New Array since we then erase the original one, we do not
    //want to erase the references too, since they are still
    //used even after creating the element
    const col = createElement(comp, props, new Array(...childArr)); 

    compArr.push(col);

    //resets the array
    childArr.length = 0;

};


await (async function(): Promise<Array<void> | void> {
    console.log("read");
    try {
        //We get the data from the current JSON 
        data = await readFromJson();
        if(!data) return;
        return console.log("done fetching bbdd");

    } catch (err) { return console.error(err) };
})();

//Main function responsible for populating the catalog
export default async function Populate() {
    
    if (!data) return console.error("can't load home BBDD not fetched");

    //Components collecting arrays to be passed as children
    //to React.createElement
    const rowPlaceholder: Array<React.ReactNode> = [];
    const columnPlaceholder: Array<React.ReactNode> = [];
    const productPlaceholder: Array<React.ReactNode> = [];
    const sectionPlaceholder: Array<React.ReactNode> = [];

    //These counter basically indicate pagination
    //for every 2 products there is 1 column
    //for every 3 columns there is 1 row
    //for every 6 columns (initially) there is 1 section
    let colCounter = 0;
    let rowCounter = 0;
    let sectionCounter = 0;
    let actualSection: string = "";

    /** Empties remainder elements in placeholders */
    function emptyRemainder(){

        //if there are not any elements left we already emptied the remainders
        if (!productPlaceholder[0] && !columnPlaceholder[0] && !rowPlaceholder[0]) return;

        //first section completes the currently incomplete row
        if (productPlaceholder.length == 1){

            colCounter++;

            const prod = createElement(EmptyProduct, {id: "1", key: "1", section: actualSection});
            productPlaceholder.push(prod);

            createPushAndEmpty(Column, { id: colCounter.toString(), key: colCounter.toString(), section: actualSection }, 
                               productPlaceholder, columnPlaceholder);


        };

        while (colCounter < 3){

            colCounter++;

            const prod0 = createElement(EmptyProduct, {id: "0", key: "0", section: actualSection});
            const prod1 = createElement(EmptyProduct, {id: "1", key: "1", section: actualSection});

            productPlaceholder.push(prod0);
            productPlaceholder.push(prod1);

            createPushAndEmpty(Column, { id: colCounter.toString(), key: colCounter.toString(), section: actualSection }, 
                               productPlaceholder, columnPlaceholder);
        };

        rowCounter++;
        colCounter = 0;

        createPushAndEmpty(Row, { id: rowCounter.toString(), key: rowCounter.toString() }, 
                           columnPlaceholder, rowPlaceholder);

        //now that we don't have any more incomplete rows, we create enough
        //of them to fill the current section "whitespace"
        while (rowCounter < 6){

            rowCounter++;

            while (colCounter < 3){

                colCounter++;

                const prod0 = createElement(EmptyProduct, {id: "0", key: "0", section: actualSection});
                const prod1 = createElement(EmptyProduct, {id: "1", key: "1", section: actualSection});

                productPlaceholder.push(prod0);
                productPlaceholder.push(prod1);

                createPushAndEmpty(Column, { id: colCounter.toString(), key: colCounter.toString(), section: actualSection }, 
                                   productPlaceholder, columnPlaceholder);
            };

            colCounter = 0;

            createPushAndEmpty(Row, { id: rowCounter.toString(), key: rowCounter.toString() }, 
                               columnPlaceholder, rowPlaceholder);

        };

        sectionCounter++;
        createPushAndEmpty(Section, { id: sectionCounter.toString(), 
                           key: sectionCounter.toString(), 
                           name: actualSection }, 
                           rowPlaceholder, sectionPlaceholder);

        rowCounter = 0;
        sectionCounter = 0;

    };

    for (let i = 0; i < data.length; i++) {

        //we define the first section
        if(!actualSection) actualSection = data[i].section;

        //if sections mismatch between products, that means a new section
        else if(actualSection != data[i].section){

            emptyRemainder();

            actualSection = data[i].section;
        }

        
        //workaround since I receive the data serialized in JSON
        const price = data[i].active ? (data[i].price as unknown as { $numberDecimal : string }).$numberDecimal as string : "Sin Stock";

        //We Create the elements and we push them into arrays
        //until they hold the right amount to be pushed onto their parents
        //we do this kind of recursively, base case being the end of the JSON
        const prod = createElement(Product, 
                                   { id: data[i].sku,
                                     key: data[i].sku, 
                                     title: data[i].name,
                                     section: actualSection,
                                     price: price, 
                                     url: data[i].url,
                                     active: data[i].active });

        if (data[i].sku == "MON0103") console.log(data[i].active);                             

        productPlaceholder.push(prod);

        //Each time we make two products, we add them to a column and so on
        if(data[i].orden % 2 == 0){ 
            colCounter++;
            createPushAndEmpty(Column, { id: colCounter.toString(), key: colCounter.toString(), section: actualSection }, 
                               productPlaceholder, columnPlaceholder);
        };

        if(colCounter == 3){
            rowCounter++;
            colCounter = 0;
            createPushAndEmpty(Row, { id: rowCounter.toString(), key: rowCounter.toString() }, 
                               columnPlaceholder, rowPlaceholder);
        };

        if(rowCounter == 6){
            sectionCounter++;
            rowCounter = 0;
            createPushAndEmpty(Section, { id: sectionCounter.toString(), 
                                          key: sectionCounter.toString(), 
                                          name: actualSection }, 
                               rowPlaceholder, sectionPlaceholder);
        };
    };

    //When we reached the last element, if we still have components, we push them
    emptyRemainder();

    return sectionPlaceholder;
};

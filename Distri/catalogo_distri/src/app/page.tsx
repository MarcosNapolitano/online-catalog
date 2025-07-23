import React, { createElement, ReactNode } from 'react';
import { readFromJson } from "./_data/utils";
import { Section, ISection } from "./_components/section";
import { Row, IRow } from "./_components/row";
import { Column, IColumn } from "./_components/column";
import Product from "./_components/product";
import { IProduct } from './_data/data';

export default async function Home() {
    
    /** Creates element pushes it into it's array and clears child's array*/
    const createPushAndEmpty = (comp: React.FC<IColumn | IRow | ISection>, 
                                props: {id: string, key?: string, className?: string},
                                childArr: Array<ReactNode>,
                                compArr: Array<ReactNode>) =>{

        //new Array since we then erase the original one, we do not
        //want to erase the references too, since they are still
        //used even after creating the element
        const col = createElement(comp, props, new Array(...childArr)); 

        compArr.push(col);

        //resets the array
        childArr.length = 0;

    }

    //Main function responsible for populating the catalog
    async function populate(): Promise<Array<ReactNode> | void>{
    
        let data: Array<IProduct> | void;

        try {
            //We get the data from the current JSON 
            data = await readFromJson();
            if(!data) return;
            
        } catch (err) { return console.error(err) };

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
        let actualSection;

        for (let i = 0; i < data.length; i++) {
            
            //we define the first section
            if(!actualSection) actualSection = data[i].section;

            //if sections mismatch between products, that means a new section
            else if(actualSection != data[i].section){

                createPushAndEmpty(Column, 
                                   { id: colCounter.toString() }, 
                                   productPlaceholder,
                                   columnPlaceholder);

                createPushAndEmpty(Row, 
                                   { id: rowCounter.toString() }, 
                                   columnPlaceholder,
                                   rowPlaceholder);

                createPushAndEmpty(Section, 
                                   { id: sectionCounter.toString() }, 
                                   rowPlaceholder,
                                   sectionPlaceholder);


                colCounter = 0;
                rowCounter = 0;
            }

            //we Create the elements and we push them into arrays
            //until they hold the right ammount to be pushed onto their parents
            //we do this kind of recursively, base case being the end of the JSON
            const prod = createElement(Product, {   id: data[i].sku,
                                                    key: data[i].sku, 
                                                    title: data[i].name,
                                                    price: data[i].price, 
                                                    url: data[i].url   });

            productPlaceholder.push(prod);

            //each time we make two products, we add them to a column and so on
            if(data[i].orden % 2 == 0){ 

                colCounter++;

                createPushAndEmpty(Column, 
                                   { id: colCounter.toString(),
                                     key: colCounter.toString()}, 
                                   productPlaceholder,
                                   columnPlaceholder);

            }

            if(colCounter == 3){

                rowCounter++;
                colCounter = 0;

                createPushAndEmpty(Row, 
                                   { id: rowCounter.toString(),
                                     key: rowCounter.toString()}, 
                                   columnPlaceholder,
                                   rowPlaceholder);

            }

            if(rowCounter == 6){

                sectionCounter++;
                rowCounter = 0;
                
                createPushAndEmpty(Section, 
                                   { id: sectionCounter.toString(),
                                     key: sectionCounter.toString() }, 
                                   rowPlaceholder,
                                   sectionPlaceholder);

            }
        }

        //when we reached the last element, if we still have components, we push them
        if(productPlaceholder[0] || columnPlaceholder[0] || rowPlaceholder[0]){

            colCounter++;
            rowCounter++;
            sectionCounter++;

            createPushAndEmpty(Column, 
                               { id: colCounter.toString(),
                                key: colCounter.toString() }, 
                               productPlaceholder,
                               columnPlaceholder);

            createPushAndEmpty(Row, 
                               { id: rowCounter.toString(),
                                 key: rowCounter.toString() }, 
                               columnPlaceholder,
                               rowPlaceholder);

            createPushAndEmpty(Section, 
                               { id: sectionCounter.toString(),
                                 key: sectionCounter.toString() },
                               rowPlaceholder,
                               sectionPlaceholder);

        };

        console.log(sectionPlaceholder);
        return sectionPlaceholder;
    }

    const app = await populate();

    return (
        <div>
            <h1>Testing</h1>
            {app ? app : "Did Not Mount"}
        </div>
    );
}

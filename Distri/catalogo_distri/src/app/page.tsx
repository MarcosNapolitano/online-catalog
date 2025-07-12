import React, { createElement, ReactNode } from 'react';
// import Image from "next/image";
import { readFromJson } from "./_data/utils";
import Section from "./_components/section";
import Row from "./_components/row";
import { Column, IColumn } from "./_components/column";
import Product from "./_components/product";
import { IProduct } from './_data/data';

export default function Home() {
    
    //creates element pushes it into it's array and clears child's array

    const createPushAndEmpty = (comp: React.FC<IColumn>, 
                                props: {id: string, className?: string},
                                childArr: Array<ReactNode>,
                                compArr: Array<ReactNode>) =>{
        const col = createElement(comp, props, childArr); 
        compArr.push(col);
        for(const i in childArr){
            childArr.pop()
        }
    }

    //main func responsible for populating the catalog
    async function populate(): Promise<Array<ReactNode> | void>{
    
        let data: Array<IProduct> | void;

        try {
            //we get the data from the current Json
            data = await readFromJson();
            if(!data) return;
            
        } catch (err) { return console.error(err) };

        //components collecting arrays to be passed as children
        //to React.createElement
        const rowPlaceholder: Array<React.ReactNode> = [];
        const columnPlaceholder: Array<React.ReactNode> = [];
        const productPlaceholder: Array<React.ReactNode> = [];
        const sectionPlaceholder: Array<React.ReactNode> = [];

        //these counter basically indicate pagination
        //for every 2 products there is 1 column
        //for every 3 columns there is 1 row
        //for every 6 columns (initially) there is 1 section
        let colCounter = 1;
        let rowCounter = 1;
        let sectionCounter = 1;
        let actualSection;

        for (let i = 0; i < data.length; i++) {
            
            //we define the first section
            if(!actualSection) actualSection = data[i].section;

            //we are starting a whole new section, last one was incomplete
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


                colCounter = 1;
                rowCounter = 1;
            }

            //we Create the elements and we push them into arrays
            //until they hold the right ammount to be pushed onto their parents
            //we do this kind of recursively, base case being the end of the JSON
            const prod = createElement(Product, {   id: data[i].sku, 
                                                    title: data[i].name,
                                                    price: data[i].price, 
                                                    url: data[i].url   });

            productPlaceholder.push(prod);

            //each time we make two products, we add them to a column and so on
            if(data[i].orden % 2 != 0){ 
                createPushAndEmpty(Column, 
                                   { id: colCounter.toString() }, 
                                   productPlaceholder,
                                   columnPlaceholder);

                colCounter++;
            }

            if(colCounter == 3){
                createPushAndEmpty(Row, 
                                   { id: rowCounter.toString() }, 
                                   columnPlaceholder,
                                   rowPlaceholder);

                rowCounter++;
                colCounter = 1;
            }

            if(rowCounter == 6){
                createPushAndEmpty(Section, 
                                   { id: sectionCounter.toString() }, 
                                   rowPlaceholder,
                                   sectionPlaceholder);

                sectionCounter++;
                rowCounter = 1;
            }
        }

        console.log(sectionPlaceholder);
        return sectionPlaceholder;
    }

    let app;

    populate().then((data) => {
        app = data;
        console.log(data + "now");
    });

    return (
        <div>
            <h1>Testing</h1>
            {app}
        </div>
    );
}

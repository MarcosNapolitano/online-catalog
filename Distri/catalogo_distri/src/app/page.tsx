import { createElement } from 'react';
// import Image from "next/image";
import { readFromJson } from "./_data/utils";
// import Section from "./_components/section";
// import Row from "./_components/row";
import Column from "./_components/column";
import Product from "./_components/product";
import { IProduct } from './_data/data';

export default function Home() {
    
    async function populate(): Promise<void>{
    
        let data: Array<IProduct> | void;

        try {
            data = await readFromJson();
            if(!data) return;
            
        } catch (err) { return console.error(err) };

        // const rowPlaceholder: Array<React.ReactNode> = [];
        // const columnPlaceholder: Array<React.ReactNode> = [];
        const productPlaceholder: Array<React.ReactNode> = [];
        
        let colCounter = 1;
        // let rowCounter = 1;


        for (let i = 0; i < data.length; i++) {

            const prod = createElement(Product, {   id: data[i].sku, 
                                                    title: data[i].name,
                                                    price: data[i].price, 
                                                    url: data[i].url   });

            productPlaceholder.push(prod);

            if(i % 2 != 0){ 
                const col = createElement(Column, { id: colCounter.toString() }, productPlaceholder);
                columnPlaceholder.push(col);
                colCounter++
            }


        }
    }
    console.log("test");
    return (

        []
    );
}


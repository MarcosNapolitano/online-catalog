'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import NotFound from "@/app/not-found";
import { IProduct } from "@/app/_data/data";
import { findSingleProduct } from "@/app/_data/utils";


export default function Page({ params, }: {params: { sku: string } }) {
    
    const [data, setData] = useState(null);

    //to do 
    //complete this!
    useEffect(() => {

    
        try{
            
            const data = await findSingleProduct(params.sku);
            setData(data);
        }
        catch (err) { console.error(err) };

    }), [];//que relodee cuando responda el post! vas a tener que poner una dependencia aca

    if (!data) return <NotFound />;

    const [form, setForm] = useState(null)
    return (
        <div>
            <h1>{ data.name }</h1>
            <Image alt="prod-image" src={`@/img/` + data.sku + ".webp"} width={200} height={200}/>
   
            <form>
                <label htmlFor="sku"><b>SKU:</b></label>
                <input name="sku" type="text" value={ data.sku } />

                <label htmlFor="price"><b>Precio GF:</b></label>
                <input name="price" type="number" value={ data.price.toString() } />

                <label htmlFor="price2"><b>Precio Distri:</b></label>
                <input name="price2" type="number" value={ data.price2.toString() } />

                <label htmlFor="section"><b>Sección:</b></label>
                <input name="section" type="text" value={ data.section } />

                <label htmlFor="orden"><b>Orden:</b></label>
                <input name="orden" type="number" value={ data.orden } />

                <label htmlFor="image"><b>Imágen:</b></label>
                <input name="image" type="file" />


            </form>
        </div>
    );
}

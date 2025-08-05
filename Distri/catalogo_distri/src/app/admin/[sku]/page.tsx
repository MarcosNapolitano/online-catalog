import NotFound from "@/app/not-found";
import { IProduct } from "../../_data/data";
import { findSingleProduct } from "../../_data/utils";


export default async function Page({ params, }: {params: { sku: string } }) {
    
    //to do 
    //to be replaced with props from parent component
    //we do not need to query the database this time we already got the data
    const data: IProduct | null | undefined = await findSingleProduct(params.sku);

    if (!data) return <NotFound />;

    return (
        <div>
            <h1>{ data.name }</h1>
            <p><b>SKU:</b> { data.sku }</p>
            <p><b>Precio GF:</b> { data.price.toString() }</p>
            <p><b>Precio Distri:</b> { data.price2?.toString() }</p>
            <p><b>Sección:</b> { data.section }</p>
            <p><b>Orden:</b> { data.orden }</p>
        </div>
    );
}

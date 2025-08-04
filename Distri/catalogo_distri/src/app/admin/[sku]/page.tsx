import NotFound from "@/app/not-found";
import { IProduct, Product } from "../../_data/data";
import { findSingleProduct } from "../../_data/utils";


export default async function Home({ params, }: {params: Promise<{ slug: string }>}) {
    
    let slug;

    try{ slug = await params; }
    catch (err) { console.error (err) };

    const data: IProduct | null | undefined = await findSingleProduct(slug);

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

import { Product } from "@/app/_data/data";
import { NextRequest, NextResponse } from "next/server";
import { findProductbyOrder, saveProduct, saveProducts } from '@/app/_data/utils';

const sections: Map<string, number> = new Map();

sections.set("kiosco", 1);
sections.set("almacen", 2);
sections.set("nucete", 3);
sections.set("cafe", 4);
sections.set("te", 5);
sections.set("yerba", 6);
sections.set("edulcorantes", 7);
sections.set("galletitas", 8);
sections.set("medicamentos", 9);
sections.set("limpieza", 10);
sections.set("higiene", 11);
sections.set("varios", 12);
sections.set("bebidas", 13);
sections.set("promocion", 14);

export async function POST(req: NextRequest) {

    const fetchData = async () => {
        try{
            return await req.json();
        }
        catch(err) { console.error(err) }

    };

    const data = await fetchData();
    console.log(data)
    if (!data) return NextResponse.json("No data received.")

    const prod = new Product();

    prod.sku = data.sku;
    prod.name = data.name;
    prod.url = data.sku;
    prod.price = data.price;
    prod.price2 = data.price2;
    prod.section = data.section;
    prod.active = data.active;
    prod.sectionOrden = sections.get(prod.section);

    const nextProds = await findProductbyOrder(data.section, data.orden);
    
    if (data.image) await fetch("@/app/api/upload_img", { method: "POST", body: data.image });

    //we move 1 position all products from the new product index to the end
    if (nextProds){

        nextProds.map((a) => a.orden + 1);
        saveProducts(nextProds);

    };

    saveProduct(prod);

    return NextResponse.json(data);

}

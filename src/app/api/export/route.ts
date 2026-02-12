import { IProduct } from "@/app/_data/types"
import { findProducts } from "@/app/_services/product_utils";
import { NextResponse } from "next/server";

export async function GET() {
  const products: IProduct[] | undefined = await findProducts("distri");
  if (products) {

    const headers = Object.keys(products[1]).join(",");
    const rows = products.map(obj => {

      const objData = [
        obj["active"],
        obj["special"],
        obj["sku"],
        obj["name"],
        obj["price"],
        obj["price2"],
        obj["orden"],
        obj["sectionOrden"],
        obj["sectionOrdenGianfranco"],
        obj["section"],
        obj["url"],
        obj["gianfrancoExclusive"]
      ]

      if(obj.subProduct) 
        objData.push(obj.subProduct.sku, obj.subProduct.price, obj.subProduct.price2);

      return objData.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });

    const csv = [headers, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="data.csv"',
      },
    });

  } else { console.error("No Data Received"); };
}

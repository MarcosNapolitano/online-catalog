import Image from "next/image";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { findSingleProduct, editProduct } from "@/app/_services/product_utils";
import ProductForm from "@/app/_components/product-form";


export default async function Page({ params, }: { params: Promise<{ sku: string }> }) {

  const sku = await params;
  const data = await findSingleProduct(sku.sku);
  if (!data) return <NotFound />;

  const prop: ProductForm = {
    sku: data.sku,
    name: data.name,
    price: data.price.toString(),
    price2: data.price2.toString(),
    section: data.section,
    orden: data.orden,
    special: data.special
  }

  return (
    <div>
      <h1>{data.name}</h1>
      <Image alt="prod-image" src={`/img/` + data.sku + ".webp"} width={200} height={200} />
      <ProductForm data={prop} />
      <button style={{marginTop: "2%"}}><Link href="/admin/">Volver</Link></button>
    </div>
  );
}

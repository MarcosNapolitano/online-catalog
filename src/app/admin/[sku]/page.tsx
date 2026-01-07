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

  if (data.subProduct) {
    const subProduct = {
      sku: data.subProduct.sku,
      price: data.subProduct.price.toString(),
      price2: data.subProduct.price2.toString()
    };
    prop.subProduct = subProduct;
  }
  const prefix = process.env.NODE_ENV === "production" ?
    "https://raw.githubusercontent.com/MarcosNapolitano/online-catalog/refs/heads/main/public/img/" : "/img/"

  return (
    <div>
      <h1>{data.name}</h1>
      <Image alt="prod-image" src={`${prefix}${data.sku}.webp`} width={200} height={200} />
      <ProductForm data={prop} />
      <Link className='button' href="/admin/">Volver</Link>
    </div>
  );
}

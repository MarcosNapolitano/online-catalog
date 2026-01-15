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
  const URL = `${process.env.URL}/${process.env.CDN_ACCOUNT_ID}/${data.url}/public`;

  return (
    <div>
      <h1>{data.name}</h1>
      <Image alt="prod-image" src={URL} width={200} height={200} />
      <ProductForm data={prop} />
      <Link className='button' href="/admin/">Volver</Link>
    </div>
  );
}

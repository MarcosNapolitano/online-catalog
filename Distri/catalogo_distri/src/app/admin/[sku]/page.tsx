import Image from "next/image";
import Link from "next/link";
import NotFound from "@/app/not-found";
import { IProduct } from "@/app/_data/data";
import { findSingleProduct, editProduct } from "@/app/_data/utils";
import ProductForm from "@/app/_components/product-form";


export default async function Page({ params, }: { params: { sku: string } }) {

  const sku = await params;
  const data = await findSingleProduct(sku.sku);
  if (!data) return <NotFound />;

  return (
    <div>
      <h1>{data.name}</h1>
      <Image alt="prod-image" src={`/img/` + data.sku + ".webp"} width={200} height={200} />

        <ProductForm data={data} />
        <h2><Link href="/admin/">Volver</Link></h2>
    </div>
  );
}

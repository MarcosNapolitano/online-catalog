import { Search } from "@/app/_components/search"
import { type IProduct, type Response } from "@/app/_data/types";
import { findProducts, findProductsSimplified, toggleProduct } from "@/app/_services/product_utils";
import Populate from "@/app/_app/home";
import Link from "next/link";
import CsvForm from "@/app/_components/csv-form";
import { cookies } from "next/headers";
import { MiscFunctions } from "@/app/_components/misc-functions";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";

const toggleActive = async (sku: string): Promise<true | false> => {
  'use server'
  try {
    await toggleProduct(sku);
    return true;
  }
  catch (err) { console.log("Couldn't toggle product"); return false; }
};

const refreshCatalog = async (): Promise<Response> => {
  'use server'
  revalidateTag('catalog');

  return {
    success: true,
    message: "Catalogo Revalidado",
    error: undefined
  };
};


export default async function Home() {

  const products: Promise<IProduct[] | undefined> = findProductsSimplified();

  const user = await cookies().then((cookie) => {
    const userName = cookie.get('userName')?.value
    return userName ? ''.concat(userName[0].toUpperCase(), userName?.slice(1)) : ''
  });

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <h2>Wellcome <span className="pageLink-active">{user}</span></h2>
      <Suspense fallback={<Loading />}>
        <Search products={products} backAction={toggleActive} />
      </Suspense>
      <MiscFunctions refreshCatalog={refreshCatalog} />
      <CsvForm />
    </div>
  );
}


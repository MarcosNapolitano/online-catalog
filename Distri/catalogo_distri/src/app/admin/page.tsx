import { Search } from "@/app/_components/search"
import { IProduct } from "@/app/_data/data";
import { findProducts, findProductsSimplified, toggleProduct, writeBaseJson } from "@/app/_data/utils";
import Populate, { readData } from "../_app/home";
import Link from "next/link";
import { revalidateTag } from "next/cache";

const toggleActive = async (sku: string): Promise<true | false> => {
  'use server'
  try{
    await toggleProduct(sku);
    return true;
  }
  catch (err) { console.log("Couldn't toggle product"); return false;}
};

export default async function Home() {

  const data: IProduct[] | undefined = await findProductsSimplified();

  const handleClickAction = async () => {
    'use server'
    const data: IProduct[] | undefined = await findProducts();
    if (data) {

      await writeBaseJson(data);
      await readData();
      revalidateTag('catalog');

      console.log("Data fetched and updated");

    }else{ console.error("No Data Received"); };

  };

  return (
    <div>
      <h1>Wellcome to the admin panel</h1>
      <Search data={data} backAction={toggleActive} />
      <button onClick={handleClickAction}>Refresh Catalog</button>
      <Link href="/admin/create">Crear Producto</Link>
    </div>
  );
}


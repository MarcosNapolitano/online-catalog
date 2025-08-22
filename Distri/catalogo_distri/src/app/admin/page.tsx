import { Search } from "@/app/_components/search"
import { IProduct } from "@/app/_data/data";
import { findProductsSimplified, toggleProduct } from "@/app/_data/utils";
import { Passero_One } from "next/font/google";


const toggleActive = async (sku: string): Promise<true | false> => {
  'use server'
  try{
    return await toggleProduct(sku);
  }
  catch (err) { console.log("Couldn't toggle product"); return false;}
};

export default async function Home() {

  const data: IProduct[] | undefined = await findProductsSimplified();

  return (
    <div>
      <h1>Wellcome to the admin panel</h1>
      <Search data={data} backAction={toggleActive} />
    </div>
  );
}

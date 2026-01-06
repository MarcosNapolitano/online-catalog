import { Search } from "@/app/_components/search"
import { type IProduct } from "@/app/_data/types";
import { findProducts, findProductsSimplified, toggleProduct } from "@/app/_services/product_utils";
import Populate from "@/app/_app/home";
import Link from "next/link";
import { revalidateTag } from "next/cache";
import CsvForm from "@/app/_components/csv-form";
import TxtForm from "@/app/_components/txtForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const toggleActive = async (sku: string): Promise<true | false> => {
  'use server'
  try {
    await toggleProduct(sku);
    return true;
  }
  catch (err) { console.log("Couldn't toggle product"); return false; }
};

export default async function Home() {

  const products: IProduct[] | undefined = await findProductsSimplified();

  const refreshCatalog = async () => {
    'use server'
    revalidateTag('catalog');
  };

  const downloadCSV = async () => {
    'use server'
    redirect("/api/export");
  };

  const user = await cookies().then((cookie) => {
    const userName = cookie.get('userName')?.value
    return userName ? ''.concat(userName[0].toUpperCase(), userName?.slice(1)) : ''
  });

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <h2>Wellcome <span className="pageLink-active">{user}</span></h2>
      <Search products={products} backAction={toggleActive} />
      <h3>Funciones Varias</h3>
      <div className="misc-functions">
        <button onClick={refreshCatalog}>Refresh Catalog</button>
        <button onClick={downloadCSV}>Download CSV</button>
        <button>
          <Link href="/admin/create">Crear Producto</Link>
        </button>
      </div>
      <CsvForm />
      {/* <TxtForm /> */}
    </div>
  );
}


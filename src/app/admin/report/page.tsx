import { getList } from "@/app/_services/list_utils"
import { diffLines } from "diff"
import { ReactNode } from "react";
import { ProductChange } from "@/app/_data/types";
import { updatePricesByName } from "@/app/_services/product_utils";
import NotFound from "@/app/not-found";
import { UpdateProducts } from "@/app/_components/update-products";
import Link from "next/link";

export default async function Home({ searchParams }:
  { searchParams: Promise<{ id: 2 | 1 }> }) {

  const params = await searchParams;

  if (params.id < 1 || params.id > 2 || !params.id) return <NotFound />

  const list = await getList(params.id);
  if (!list) return;

  const changeIndex: Map<string, ProductChange> = new Map();
  const diff = diffLines(list.old, list.new)

  const priceChanges: ReactNode[] = [];
  const newProducts: ReactNode[] = [];
  const productsToEliminate: ReactNode[] = [];


  diff.forEach(part => {
    if (!part.added && !part.removed) return;

    const currentPart = part.value.split("\n")

    for (let i = 0; i < currentPart.length; i++) {

      const currentElement = currentPart[i].split(";")
      const name = currentElement[0]
      const price = currentElement[1]

      const productObject = part.added ? { new: price } : { old: price }

      if (!changeIndex.get(name)) {
        changeIndex.set(name, productObject)
      }
      else {
        if (part.added)
          changeIndex.get(name)!.new = price
        else
          changeIndex.get(name)!.old = price
      };
    }
  })

  changeIndex.forEach((price: ProductChange, element: string) => {

    if (price.old && price.new) {

      // sometimes spaces get added to the end of the price
      if (price.old.trim() === price.new.trim()) return;

      const oldPrice = params.id == 1 ? Math.ceil(parseFloat(price.old) * 1.135) : price.old;
      const newPrice = params.id == 1 ? Math.ceil(parseFloat(price.new) * 1.135) : price.new;

      return priceChanges.push(
        <p className="product-result" key={element}>{`${element};${newPrice};`}
          <span className={newPrice > oldPrice ? "error-message" : "success-message"}>
            {`${oldPrice}`}
          </span>
        </p>
      )

    }
    if (price.old)
      return productsToEliminate.push(<p className='error-message product-result' key={element}>{`${element};${price.old}`}</p>)
    if (price.new)
      return newProducts.push(<p className='success-message product-result' key={element}>{`${element};${price.new}`}</p>)

  });

  return <div>
    <h1>Reporte de Precios</h1>
    <div className='basic-panel' style={{ display: "flex", justifyContent: "space-around", margin: "2rem 0" }}>
      <div>
        <h2 style={{ marginBottom: "1rem" }}>Productos a Eliminar</h2>
        {productsToEliminate}
      </div>
      <div>
        <h2 style={{ marginBottom: "1rem" }}>Productos Nuevos</h2>
        {newProducts}
      </div>
    </div>
    <div className="basic-panel">
      <h2 style={{ marginBottom: "1rem" }}>Cambios de Precios</h2>
      {priceChanges}
      <UpdateProducts changeIndex={changeIndex} listID={params.id.toString() as '1' | '2'} />
      <Link className='button' href="/admin/">Volver</Link>
    </div>
  </div>;
}

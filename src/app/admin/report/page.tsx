import ListForm from "@/app/_components/list-form"
import { getList } from "@/app/_services/list_utils"
import { diffLines } from "diff"
import { ReactNode } from "react";

interface ProductChange {
  new?: string;
  old?: string
}

export default async function Home() {
  // return <ListForm />

  const list = await getList(1);
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
      if(price.old.trim() === price.new.trim()) return;

      return priceChanges.push(
        <p key={element}>{`${element} cambio de $${price.old} a `}
          <span className={price.new > price.old ? "error-message" : "success-message"}>
            {`$${price.new}`}
          </span>
        </p>
      )

    }
    if (price.old)
      return productsToEliminate.push(<p className='error-message' key={element}>{`${element} se quito de lista.`}</p>)
    if (price.new)
      return newProducts.push(<p className='success-message' key={element}>{`${element} se arego a la lista.`}</p>)

  });

  return <div>
    <div style={{ display: "flex" }}>
      <div>
        {productsToEliminate}
      </div>
      <div>
        {newProducts}
      </div>
    </div>
    {priceChanges}
  </div>;
}

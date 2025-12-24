import React from 'react';
import Image from 'next/image'
import { type IProductComp } from '@/app/_data/types';

function priceFormatter(price: string): string {
  price = price.replace(".", ",");
  switch (price.length) {

    case 8:
      price = price.slice(0, 2).concat(".").concat(price.slice(-6));
      break
    case 7:
      price = price.slice(0, 1).concat(".").concat(price.slice(-6));
      break
    default:
      break
  };

  return price;
}

export const Product: React.FC<IProductComp> = (
  { id,
    title,
    section,
    price,
    url,
    active,
    special,
    price2 }
) => {

  price = priceFormatter(price);

  if (price2)
    price2 = priceFormatter(price2);

  const prefix = process.env.NODE_ENV === "production" ?
    "https://raw.githubusercontent.com/MarcosNapolitano/online-catalog/refs/heads/main/public/img/" : "/img/"

  return (
    <div id={"product-" + id} className="product">

      {special !== "" && active &&
        <Image id={"image-" + id} alt="oferta" className="ribbon prod-image"
          src={`${prefix}${special === "oferta" ? "oferta" : "novedad"}.webp`}
          width={100}
          height={100} />}

      <Image id={"image-" + id}
        alt="producto"
        className={active ? "prod-image" : "prod-image inactive"}
        src={`${prefix}${id}.webp`} width={200} height={200} />
      <div className="prod-info">
        {price2 ?
          <p id={"title-" + id} className="sub-title title">{`${title} Precio Unitario: $${price2}`}</p>
          :
          <p id={"title-" + id} className="title">{title}</p>
        }
        <p id={"price-" + id}
          className={`${section}-price price`}>{active ? "$" + price : price}</p>
      </div>
    </div>
  );
};


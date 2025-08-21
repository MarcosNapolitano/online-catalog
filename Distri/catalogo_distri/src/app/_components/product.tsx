import React from 'react';
import Image from 'next/image'

export interface IProduct {
  id: string,
  title: string,
  section: string,
  price: string,
  url: string,
  active: boolean,
  special: "oferta" | "novedad" | ""
}

const Product: React.FC<IProduct> = ({ id, title, section, price, url, active, special }) => {
  return (
    <div id={"product-" + id} className="product">

      { special !== "" && active &&
        <Image id={"image-" + id} alt="oferta" className="ribbon prod-image"
          src={`/img/${special === "oferta" ? "oferta" : "novedad"}.webp`} width={100} height={100} /> }


      <Image id={"image-" + id} alt="producto" className={active ? "prod-image" : "prod-image inactive"}
        src={`/img/` + id + ".webp"} width={200} height={200} />
      <div className="prod-info">
        <p id={"title-" + id} className="title">{title}</p>
        <p id={"price-" + id} className={`${section}-price price`}>{active ? "$" + price : price}</p>
      </div>
    </div>
  );
};

export default Product;

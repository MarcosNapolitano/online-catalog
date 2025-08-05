import React from 'react';
import Image from 'next/image'

export interface IProduct{
  id: string;
  title: string;
  section?: string;
  price: string;
  url: string;
  active?: string;
}

const Product: React.FC<IProduct> = ({ id, title, section, price, url, active }) => {
  return (
        <div id={"product-" + id} className="product">
          <Image id={"image-" + id} alt="producto" className={active ? `prod-image ${active}` : "prod-image"} 
                 src={`/img/` + url + ".webp"} width={200} height={200}/>
          <div className="prod-info">
              <p id={"title-" + id} className="title">{title}</p>
              <p id={"price-" + id} className={`${section}-price price`}>{active ? price : "$" + price}</p>
          </div>
      </div>
  );
};

export default Product;


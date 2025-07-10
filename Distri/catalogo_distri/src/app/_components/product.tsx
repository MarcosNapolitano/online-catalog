import React from 'react';
import Image from 'next/image'

interface IProduct{
  id: string;
  title: string;
  price: number;
  url: string;
  
}

const Product: React.FC<IProduct> = ({ id, title, price, url }) => {
  return (
      <div id={id} className="product">
          <Image id={"img" + id} alt="producto" className="prod-image" src={url} />
          <div className="prod-info">
              <p id={"title" + id} className="title">{title}</p>
              <p id={"price".toString() + id} className="price">{price}</p>
          </div>
      </div>
  );
};

export default Product;


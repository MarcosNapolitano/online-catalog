import React from 'react';
import Image from 'next/image'
import { Types } from 'mongoose';

interface IProduct{
  id: string;
  title: string;
  price: Types.Decimal128;
  url: string;
  
}

const Product: React.FC<IProduct> = ({ id, title, price, url }) => {
  return (
      <div id={id} className="product">
          <Image id={"img" + id} alt="producto" className="prod-image" src={url} width="200" height="200"/>
          <div className="prod-info">
              <p id={"title" + id} className="title">{title}</p>
              <p id={"price".toString() + id} className="price">{price.toString()}</p>
          </div>
      </div>
  );
};

export default Product;


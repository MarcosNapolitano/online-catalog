import React from 'react';
import Image from 'next/image'

interface IProduct{
  id: string;
  title: string;
  price: string;
  url: string;
  
}
//to do - remove section from image url!!
const Product: React.FC<IProduct> = ({ id, title, price, url }) => {
  return (
      <div id={"product-" + id} className="product">
          <Image id={"image-" + id} alt="producto" className="prod-image" 
                 src={"/img/galletitas/" + url + ".png"} width={200} height={200}/>

          <div className="prod-info">
              <p id={"title-" + id} className="title">{title}</p>
              <p id={"price-" + id} className="price">{"$" + price}</p>
          </div>
      </div>
  );
};

export default Product;


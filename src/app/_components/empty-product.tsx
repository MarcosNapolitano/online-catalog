import React from 'react';
import Image from 'next/image';
import { type IEmptyProduct } from '@/app/_data/types';

export const EmptyProduct: React.FC<IEmptyProduct> = ({ id, section }) => {

  const prefix = process.env.NODE_ENV === "production" ?
    "https://raw.githubusercontent.com/MarcosNapolitano/online-catalog/refs/heads/main/public/img/" : "/img/"
    
  return (
        <div id={"product-" + id} className="product">
          <Image id={"image-" + id} alt="placeholder" className="prod-image" 
                 src={`${prefix}placeholder.webp`} width={200} height={200}/>
          <div className="prod-info">
              <p id={"title-" + id} className="title">&nbsp;</p>
              <p id={"price-" + id} className={`${section}-price price`}>&nbsp;</p>
          </div>
      </div>
  );
};

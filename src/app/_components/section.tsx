import Image from 'next/image';
import React from 'react';
import backgroundImage from '@/../public/img/back.webp'
import Link from 'next/link';
import { ISection } from '@/app/_data/types';

export const Section: React.FC<ISection> = ({ id, name, user, children }) => {

  const prefix = process.env.NODE_ENV === "production" ?
    "https://raw.githubusercontent.com/MarcosNapolitano/online-catalog/refs/heads/main/public/img/" : "/img/"

  const logoHeader = <Image className="logo header-logo" alt="logo" src={`${prefix}logo.png`} height={100} width={250} />
  const logoFooter = <Image className="logo" alt="logo" src={`${prefix}logo.png`} height={100} width={250} />
  const phone = user === "gianfranco" ? "11-3478-6787" : "11-6679-5149";

  // to do: this is a provisional patch up, fix later
  const Make = name === 'limpieza' ? 'make' : name

  return (
    <section id={name + "-" + id} className={`${name} section`} style={{ backgroundImage: `url(${backgroundImage.src})` }}>
      <div className={`svg section-header ${id === "1" ? "category-header" : ""}`}>
        <h2 className={`header header-` + name}>{Make?.toUpperCase()}</h2>
        {id === "1" && user !== "gianfranco" && logoHeader}
      </div>
      {children}
      <div className="svg section-footer">
        <footer className="footer">
          <a href={`https://wa.me/54${phone}`} className="footer-link">
            Recibí Nuestras Ofertas Al WhatsApp: {phone}
          </a>
        </footer>
        <a href={"#0"} style={{ zIndex: "2" }} >
          {user !== "gianfranco" && logoFooter}
        </a>
      </div>
    </section>
  );
};

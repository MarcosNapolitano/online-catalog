import Image from 'next/image';
import React from 'react';
import backgroundImage from '@/../public/img/back.webp'
import Link from 'next/link';
import { ISection } from '@/app/_data/types';

export const Section: React.FC<ISection> = ({ id, name, user, children }) => {

  const logoHeader = <Image className="logo header-logo" alt="logo" src="/img/logo.png" height={100} width={250} />
  const logoFooter = <Image className="logo" alt="logo" src="/img/logo.png" height={100} width={250} />
  const phone = user === "gianfranco" ? "11-3478-6787" : "11-6679-5149";

  return (
    <section id={ name + "-" + id } className={`${name} section`} style={{ backgroundImage: `url(${backgroundImage.src})` }}>
        <div className={`svg section-header ${id === "1" ? "category-header" : ""}`}>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
            </svg>
            <h2 className={ `header header-` + name }>{name?.toUpperCase()}</h2>
            {id === "1" && user !== "gianfranco" && logoHeader }
        </div>
        {children}
        <div className="svg section-footer">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
            </svg>
            <footer className="footer">
              <a href={`https://wa.me/54${phone}`} className="footer-link">Recibí Nuestras Ofertas</a>
              <br />
              <a href={`https://wa.me/54${phone}`} className="footer-link">WhatsApp: 11-6679-5149</a>
            </footer>
            <a href={"#0"} style={{ zIndex: "2"}} >
              { user !== "gianfranco" && logoFooter }
            </a>
        </div>
    </section>
  );
};

import Image from 'next/image';
import React from 'react';
import backgroundImage from '@/../public/img/back.webp'
import Link from 'next/link';
import { ISection } from '@/app/_data/types';

export const Section: React.FC<ISection> = ({ id, name, user, children }) => {

  const LOGO = '22a17ae3b8c185b6112779f08ebc580a8c46c737ceeac04f6384d2a3e3a0176f';
  const LOGO_JP = 'b2ba2003-cb91-41d1-3bc1-94e0f338a600';
  const URL = `${process.env.CDN_URL}/${process.env.CDN_HASH}/${user === 'gianfranco' ? LOGO_JP : LOGO}/public`;
  const logoHeader = <Image className="logo header-logo" alt="logo" src={URL} height={100} width={250} />
  const logoFooter = <Image className="logo" alt="logo" src={URL} height={100} width={250} />
  const phone = user === "gianfranco" ? "11-2193-5653" : "11-6679-5149";

  return (
    <section id={name + "-" + id}
      className={`${name} section ${user === 'gianfranco' && 'section-gf gf-border'}`}
      style={{
        backgroundImage: `url(${backgroundImage.src})`
      }}>
      <svg className="header-shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
      </svg>
      <div className={
        `svg section-header 
        ${user === 'gianfranco' && 'section-header-gf'}
        ${id === "1" ? "category-header" : ""}`
      }>
        <h2 className={
          `header header-${name} 
          ${user === 'gianfranco' && 'gf-header'}`
        }>
          {name?.toUpperCase()}
        </h2>
        {id === "1" && logoHeader}
      </div>
      {children}
      <div className={`svg section-footer ${user === 'gianfranco' && 'section-header-gf'}`}>
        <footer className="footer">
          <a href={`https://wa.me/54${phone}`} className="footer-link">
            Recibí Nuestras Ofertas Al WhatsApp: {phone}
          </a>
        </footer>
        <a href={"#0"} style={{ zIndex: "2" }} >
          {logoFooter}
        </a>
      </div>
      <svg className="bottom-shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
      </svg>
    </section>
  );
};

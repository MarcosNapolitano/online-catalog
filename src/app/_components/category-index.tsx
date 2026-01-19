import Image from "next/image";
import React, { ReactNode } from "react";
import backgroundImage from '@/../public/img/back.webp'
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';
import { Deslogeo } from '@/app/_components/deslogeo';
import { JsonWebToken } from "../_data/types";

export const CategoryIndex = ({user}: {user: string}): ReactNode => {


  const LOGO_HASH = '22a17ae3b8c185b6112779f08ebc580a8c46c737ceeac04f6384d2a3e3a0176f';
  const URL = `${process.env.CDN_URL}/${process.env.CDN_HASH}/${LOGO_HASH}/public`;

  const logo = <Image className="logo index-logo" alt="logo" src={URL} height={100} width={250} />
  const phone = user === "gianfranco" ? "11-3478-6787" : "11-6679-5149";

  const logout = async () => {
    'use server'
    const cookie = await cookies();
    cookie.delete('auth_token');
    cookie.delete('userName');

    redirect('/login', RedirectType.replace)
  };

  return (
    <section id="0" className="section" style={{ backgroundImage: `url(${backgroundImage.src})`, minHeight: "100dvh" }}>
      <div className="svg section-header index">
        <h2 className='header index-header' >Elija la categoría deseada</h2>
        {user !== "gianfranco" && logo}
      </div>
      <div className='index-categories'>
        <ul className='index-list-container'>
          <li className="index-category header-almacen"><a href="#almacen-1">Almacén</a></li>
          <li className="index-category header-bebidas"><a href="#bebidas-1">Bebidas</a></li>
          <li className="index-category header-cafe"><a href="#cafe-1">Café</a></li>
          <li className="index-category header-edulcorantes"><a href="#edulcorantes-1">Edulcorantes</a></li>
          <li className="index-category header-galletitas"><a href="#galletitas-1">Galletitas</a></li>
          <li className="index-category header-medicamentos"><a href="#medicamentos-1">Medicamentos</a></li>
          <li className="index-category header-higiene"><a href="#higiene-1">Higiene</a></li>
        </ul>
        <ul className='index-list-container'>
          <li className="index-category header-nucete"><a href="#nucete-1">Nucete</a></li>
          <li className="index-category header-kiosco"><a href="#kiosco-1">Kiosco</a></li>
          <li className="index-category header-make"><a href="#make-1">Make</a></li>
          <li className="index-category header-varios"><a href="#varios-1">Varios</a></li>
          <li className="index-category header-te"><a href="#te-1">Té</a></li>
          <li className="index-category header-yerba"><a href="#yerba-1">Yerba</a></li>
          <li className="index-category header-promocion"><a href="#promocion-1">Promocion</a></li>
        </ul>
        {process.env.NODE_ENV === "production" && <Deslogeo action={logout} />}
      </div>
      <div className="svg section-footer">
        <footer className="footer">
        </footer>
      </div>
    </section>
  )
};

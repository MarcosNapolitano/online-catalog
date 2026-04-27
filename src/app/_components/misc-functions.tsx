'use client'
import React, { useState, useActionState } from 'react';
import Link from 'next/link';
import { MiscComp, type Response } from '../_data/types';

export const MiscFunctions: React.FC<MiscComp> = ({ refreshCatalog }):
  React.JSX.Element => {

  const initialState: Response = {
    success: false,
    message: "",
    error: undefined,
  };

  const [response, setResponse] = useState<Response>(initialState)

  const handleRefreshCatalog = async () => setResponse(await refreshCatalog())

  // avoids nextjs router to prevent fake loop
  const downloadCSV = () => window.location.href = "/api/export";
  const downloadMayorista = () => window.location.href = "/api/list?id=1";
  const downloadMinorista = () => window.location.href = "/api/list?id=2";

  return <div>
    <h3>Funciones Varias</h3>
    <div className="misc-functions">
      <button className='button' onClick={handleRefreshCatalog}>
        Refresh Catalog
      </button>
      <Link className='button' href="/admin/create">
        Crear Producto
      </Link>
      <Link href="/admin/report?id=1"
        className="button edit-button">Informe Mayorista</Link>
      <Link href="/admin/report?id=2"
        className="button edit-button">Informe Minorista</Link>
      <button className='button' onClick={downloadCSV}>Download CSV</button>
      <button className='button' onClick={downloadMayorista}>Download Mayorista</button>
      <button className='button' onClick={downloadMinorista}>Download Minorista</button>
    </div>
    <p className={response.success ? 'success-message' : 'error-message'}>
      {response.message}
    </p>
  </div>
}

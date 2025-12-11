'use client'
import React from 'react';
import { type IDeslogeo } from '@/app/_data/types';

export const Deslogeo: React.FC<IDeslogeo> = ({ action }) : React.JSX.Element => {
  return (
    <button className="no-print" onClick={() => action()}>LogOut</button>
  );
};

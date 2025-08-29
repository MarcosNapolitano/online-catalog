'use client'
import React from 'react';
import { type IDeslogeo } from '@/app/_data/types';

export const Deslogeo: React.FC<IDeslogeo> = ({ action }) : React.JSX.Element => {
  return (
    <button onClick={() => action()}>LogOut</button>
  );
};

'use client'
import React from 'react';

export interface IDeslogeo{
  action: () => void;
}

export const Deslogeo: React.FC<IDeslogeo> = ({ action }) : React.JSX.Element => {
  return (
    <button onClick={() => action()}>LogOut</button>
  );
};

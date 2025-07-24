import React from 'react';

export interface ISection{
  id: string;
  children?: React.ReactNode;
}

export const Section: React.FC<ISection> = ({ id, children }) => {
  return (
    <section id={id} className="section">
      {children}
    </section>
  );
};

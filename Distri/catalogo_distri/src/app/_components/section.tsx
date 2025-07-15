import React from 'react';

export interface ISection{
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export const Section: React.FC<ISection> = ({ id, className, children }) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

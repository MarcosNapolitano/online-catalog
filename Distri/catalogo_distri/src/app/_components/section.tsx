import React from 'react';

interface ISection{
  id: string;
  className?: string;
  children?: React.ReactNode;
}

const Section: React.FC<ISection> = ({ id, className, children }) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

export default Section;

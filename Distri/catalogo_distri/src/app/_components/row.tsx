import React from 'react';

interface IRow{
  id: string;
  className?: string;
  children: React.ReactNode;
}

const Row: React.FC<IRow> = ({ id, className, children }) => {
  return (
    <div id={"row" + id} className={className}>
      {children}
    </div>
  );
};

export default Row;

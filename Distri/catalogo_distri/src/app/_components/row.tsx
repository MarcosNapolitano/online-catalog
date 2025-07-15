import React from 'react';

export interface IRow{
  id: string;
  className?: string;
  children?: React.ReactNode;
}

export const Row: React.FC<IRow> = ({ id, className, children }) => {
  return (
    <div id={"row" + id} className={className}>
      {children}
    </div>
  );
};

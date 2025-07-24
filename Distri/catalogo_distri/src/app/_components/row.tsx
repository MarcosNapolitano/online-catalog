import React from 'react';

export interface IRow{
  id: string;
  children?: React.ReactNode;
}

export const Row: React.FC<IRow> = ({ id, children }) => {
  return (
    <div id={"row" + id} className="row">
      {children}
    </div>
  );
};

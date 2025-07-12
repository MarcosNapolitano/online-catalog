import React from 'react';

export interface IColumn{
  id: string;
  children?: React.ReactNode;
}

// React.fc makes the children at the interface optional!
export const Column: React.FC<IColumn> = ({ id, children }) : React.JSX.Element => {
  return (
    <div id={"column" + id} className="column" >
      {children}
    </div>
  );
};

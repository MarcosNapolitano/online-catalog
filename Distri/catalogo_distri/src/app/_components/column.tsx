import React from 'react';

export interface IColumn{
  id: string;
  section?: string;
  children?: React.ReactNode;
}

// React.fc makes the children at the interface optional!
export const Column: React.FC<IColumn> = ({ id, section, children }) : React.JSX.Element => {
  return (
    <div id={"column-" + id} className={`${section} column`} >
      {children}
    </div>
  );
};

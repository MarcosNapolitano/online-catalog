import React from 'react';
import { IColumn } from '@/app/_data/types';

// React.fc makes the children at the interface optional!
export const Column: React.FC<IColumn> = ({ id, section, children }) : React.JSX.Element => {
  return (
    <div id={"column-" + id} className={`${section} column`} >
      {children}
    </div>
  );
};

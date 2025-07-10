import React from 'react';

interface IColumn{
  id: string;
  children: React.ReactNode;
}

const Column: React.FC<IColumn> = ({ id, children }) => {
  return (
    <div id={"column" + id} className="column" >
      {children}
    </div>
  );
};

export default Column;

import React from 'react';
import { type IRow } from '@/app/_data/types';

export const Row: React.FC<IRow> = ({ id, children }) => {
  return (
    <div id={"row" + id} className="row">
      {children}
    </div>
  );
};

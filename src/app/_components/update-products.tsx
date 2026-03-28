'use client'
import React, { useState, useActionState } from 'react';
import { ProductChange, Response } from '@/app/_data/types';
import { updatePricesByName } from '@/app/_services/product_utils';

export const UpdateProducts = ({ changeIndex, listID }:
  { changeIndex: Map<string, ProductChange>, listID: 1 | 2 }): React.JSX.Element => {

  const initialState: Response = {
    success: false,
    message: "",
    error: undefined,
  };

  const [response, setResponse] = useState<Response>(initialState)

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      const data = await updatePricesByName(changeIndex, listID);
      setResponse(data);
      return data;

    }, initialState);

  return <form className="csv-form" action={formAction}>
    <input className="button edit-button" value="Update Products!" type="submit" />
    <p className={response.success ? 'success-message' : 'error-message'}>
      {response.message}
    </p>
    {response.error && <p className='error-message'>{response.error}</p>}
  </form>
}

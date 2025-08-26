"use client"

import { useActionState } from "react"
import { IProduct } from "../_data/data"
import { type Response, updateProducts } from "../_data/utils";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

interface CsvForm {
  file: File;
}

const CsvForm = (): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(async (initialState: Response, formData: FormData) => {

    return await updateProducts(formData);

  }, initialState);

  return <div>
    <form action={formAction}>
      <label htmlFor="csv"><b>Archivo CSV:</b></label>
      <label>SKU - NOMBRE - PRICE - PRICE2 - ACTIVE - ORDEN - SECTION - SECTION ORDEN</label>
      <input style={{ color: "whitesmoke" }} name="image" type="file" />

      <input value="Subir CSV" type="submit" />
      <p style={state.error ? { color: "red" } : { color: "green" }}>{state.message}</p>
    </form>
  </div>
};

export default CsvForm;

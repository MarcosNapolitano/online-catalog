"use client"
import { useActionState } from "react"
import { type IProduct } from "@/app/_data/types"
import { type Response } from "@/app/_data/types"
import { updateProducts } from "@/app/_services/product_utils";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const CsvForm = (): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      return await updateProducts(formData);

    }, initialState);

  return <div style={{ marginTop: "2%" }}>
    <form className="csv-form" action={formAction}>
      <label htmlFor="csv"><b>Importador Precios CSV:</b></label>
      <label>Columnas: SKU - PRICE - PRICE2</label>
      <fieldset className="misc-functions">
        <input style={{ color: "whitesmoke" }} name="csv" type="file" />
        <input value="Subir CSV" type="submit" />
      </fieldset>
      <p style={state.error ? { color: "red" } : { color: "green" }}>{state.error}</p>
    </form>
  </div>
};

export default CsvForm;

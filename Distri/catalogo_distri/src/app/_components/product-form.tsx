"use client"

import { useActionState } from "react"
import { IProduct } from "../_data/data"
import { type Response, editProduct } from "../_data/utils";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

interface ProductForm{

  data: IProduct;
}

const ProductForm: React.FC<ProductForm> = ({ data }): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(async (initialState: Response, formData: FormData) => {

  
    return await editProduct(formData, data.sku, data.orden)

  }, initialState);

  return <form action={formAction}>
    <label htmlFor="sku"><b>SKU:</b></label>
    <input name="sku" type="text" defaultValue={data.sku} />

    <label htmlFor="price"><b>Precio GF:</b></label>
    <input name="price" type="number" defaultValue={data.price.toString()} />

    <label htmlFor="price2"><b>Precio Distri:</b></label>
    <input name="price2" type="number" defaultValue={data.price2.toString()} />

    <label htmlFor="section"><b>Sección:</b></label>

    <select id="cat-select" defaultValue={data.section}>
      <option value="almacen">Almacén</option>
      <option value="bebidas">Bebidas</option>
      <option value="cafe">Café</option>
      <option value="edulcorantes">Edulcorantes</option>
      <option value="galletitas">Galletitas</option>
      <option value="medicamentos">Medicamentos</option>
      <option value="nucete">Nucete</option>
      <option value="kiosco">Kiosco</option>
      <option value="limpieza">Limpieza</option>
      <option value="higiene">Higiene</option>
      <option value="varios">Varios</option>
      <option value="te">Té</option>
      <option value="yerba">Yerba</option>
      <option value="promocion">Promoción</option>
    </select>

    <label htmlFor="orden"><b>Orden:</b></label>
    <input name="orden" type="number" defaultValue={data.orden} />

    <label htmlFor="image"><b>Imágen:</b></label>
    <input style={{ color: "whitesmoke" }} name="image" type="file" />

    <input value="Editar" type="submit" />
    {state.message}
  </form>

};

export default ProductForm;

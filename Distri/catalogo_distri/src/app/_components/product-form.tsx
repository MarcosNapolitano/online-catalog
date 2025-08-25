"use client"

import { useActionState } from "react"
import { IProduct } from "../_data/data"
import { type Response, editProduct, deleteProduct } from "../_data/utils";
import { useRouter } from "next/navigation";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

interface ProductForm {
  sku: string;
  name: string;
  price: string;
  price2: string;
  section: string;
  orden: number;
}

const ProductForm = ({ data }: { data: ProductForm }): React.JSX.Element => {

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (initialState: Response, formData: FormData) => {

    const response: Response = await editProduct(formData, data.sku, data.orden);
    if (response.success) {
      data.sku = formData.get("sku") as string;
      data.name = formData.get("name") as string;
      data.price = formData.get("price") as string;
      data.price2 = formData.get("price2") as string;
      data.section = formData.get("section") as string;
      data.orden = parseInt(formData.get("orden") as string);
    }
    else { console.error(response.error) };

    return response;

  }, initialState);

  const handleDeletion = async (): Promise<void> => {

    const res = confirm("Realmente desea borrar este producto?");
    if (res) {
      const deletion = await deleteProduct(data.sku)
      if (!deletion.success) {

        state.message = "No se pudo borrar el producto";
        state.error = "error at deleteProduct";
      }
      router.back();
      return;
    }
    return;
  };

  return <form action={formAction}>
    <label htmlFor="sku"><b>SKU:</b></label>
    <input name="sku" type="text" defaultValue={data.sku} required />

    <label htmlFor="name"><b>Nombre:</b></label>
    <input name="name" type="text" defaultValue={data.name} required />

    <label htmlFor="price"><b>Precio GF:</b></label>
    <input name="price" type="number" defaultValue={data.price.toString()} required />

    <label htmlFor="price2"><b>Precio Distri:</b></label>
    <input name="price2" type="number" defaultValue={data.price2.toString()} required />

    <label htmlFor="section"><b>Sección:</b></label>
    <select name="section" id="cat-select" defaultValue={data.section}>
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
    <input name="orden" type="number" defaultValue={data.orden} required />

    <label htmlFor="special"><b>Etiqueta:</b></label>
    <select name="special" id="cat-select" defaultValue="''">
      <option value="''">Ninguna</option>
      <option value="oferta">Oferta</option>
      <option value="novedad">Novedad</option>
    </select>
    <label htmlFor="image"><b>Imágen:</b></label>
    <input style={{ color: "whitesmoke" }} name="image" type="file" />

    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
      <input value="Editar Producto" type="submit" />
      <button onClick={handleDeletion} style={{ backgroundColor: "red", color: "white" }}>Borrar Producto</button>
    </div>
    <p style={state.error ? { color: "red" } : { color: "green" }}>{state.message}</p>
  </form>

};

export default ProductForm;

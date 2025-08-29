"use client"

import { useActionState } from "react"
import { type IProduct } from "@/app/_data/types"
import { type Response } from "@/app/_data/types"
import { createProduct } from "@/app/_services/product_utils";
import { useRouter } from "next/navigation";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const ProductCreateForm = (): React.JSX.Element => {

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (initialState: Response, formData: FormData) => {

    const response: Response = await createProduct(formData);

    if (response.success) {
      window.location.replace(formData.get("sku")as string);
    }
    else { console.error(response.error) };

    return response;

  }, initialState);

  return (
  <form action={formAction}>
    <label htmlFor="sku"><b>SKU:</b></label>
    <input name="sku" type="text" defaultValue="ARC0001" required />

    <label htmlFor="name"><b>Nombre:</b></label>
    <input name="name" type="text" defaultValue="Chocolate Arcor x18u." required />

    <label htmlFor="price"><b>Precio GF:</b></label>
    <input name="price" type="number" step="0.01" min="0" max="999999" defaultValue="123.45" required />

    <label htmlFor="price2"><b>Precio Distri:</b></label>
    <input name="price2" type="number" step="0.01" min="0" max="999999" defaultValue="456.54" required />

    <label htmlFor="section"><b>Sección:</b></label>
    <select name="section" id="cat-select" defaultValue="almacen-2">
      <option value="almacen-2">Almacén</option>
      <option value="bebidas-13">Bebidas</option>
      <option value="cafe-4">Café</option>
      <option value="edulcorantes-7">Edulcorantes</option>
      <option value="galletitas-8">Galletitas</option>
      <option value="medicamentos-9">Medicamentos</option>
      <option value="nucete-3">Nucete</option>
      <option value="kiosco-1">Kiosco</option>
      <option value="limpieza-10">Limpieza</option>
      <option value="higiene-11">Higiene</option>
      <option value="varios-12">Varios</option>
      <option value="te-5">Té</option>
      <option value="yerba-6">Yerba</option>
      <option value="promocion-14">Promoción</option>
    </select>

    <label htmlFor="orden"><b>Orden:</b></label>
    <input name="orden" type="number" defaultValue="101" required />

    <label htmlFor="image"><b>Imágen:</b></label>
    <input style={{ color: "whitesmoke" }} name="image" type="file" />

    <input value="Crear Producto" type="submit" required />
  </form>
  );
};

export default ProductCreateForm;

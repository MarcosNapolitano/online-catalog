"use client"
import { useActionState } from "react"
import { type IProduct } from "@/app/_data/types"
import { type Response } from "@/app/_data/types"
import { type ProductForm } from "@/app/_data/types"
import { editProduct, deleteProduct } from "@/app/_services/product_utils";
import { useRouter } from "next/navigation";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const ProductForm = ({ data }: { data: ProductForm }): React.JSX.Element => {

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      const response: Response = await editProduct(formData, data.sku, data.orden);
      if (response.success) {
        data.sku = formData.get("sku") as string;
        data.name = formData.get("name") as string;
        data.price = formData.get("price") as string;
        data.price2 = formData.get("price2") as string;
        data.section = formData.get("section") as string;
        data.orden = parseInt(formData.get("orden") as string);
        data.special = formData.get("special") as string;
        data.gianfrancoExclusive = formData.get("exclusive") ? true : false;

        if (formData.get("sub-sku")) {
          data.subProduct = {
            sku: formData.get("sub-sku") as string,
            price: formData.get("sub-price") as string,
            price2: formData.get("sub-price2") as string
          };
        };
      }
      else { console.error(response.error) };

      return response;

    }, initialState);

  const handleDeletion = async (): Promise<void> => {

    const res = confirm("Realmente desea borrar este producto?");
    if (res) {
      router.prefetch("/admin")
      const deletion = await deleteProduct(data.sku)
      if (!deletion.success) {

        state.message = "No se pudo borrar el producto";
        state.error = "error at deleteProduct";
      };
      router.push("/admin");
      return;
    };
    return;
  };

  return (
    <div>
      <form className="csv-form" action={formAction}>
        <label htmlFor="sku"><b>SKU:</b></label>
        <input name="sku" type="text" defaultValue={data.sku} required />

        <label htmlFor="name"><b>Nombre:</b></label>
        <input name="name" type="text" defaultValue={data.name} required />

        <label htmlFor="price"><b>Precio GF:</b></label>
        <input name="price" type="number" step="0.01" min="0" max="999999" defaultValue={data.price.toString()} required />

        <label htmlFor="price2"><b>Precio Distri:</b></label>
        <input name="price2" type="number" step="0.01" min="0" max="999999" defaultValue={data.price2.toString()} required />

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
          <option value="make">Make</option>
          <option value="higiene">Higiene</option>
          <option value="varios">Varios</option>
          <option value="te">Té</option>
          <option value="yerba">Yerba</option>
          <option value="promocion">Promoción</option>
        </select>

        <label htmlFor="orden"><b>Orden:</b></label>
        <input name="orden" type="number" defaultValue={data.orden} required />

        <label htmlFor="special"><b>Etiqueta:</b></label>
        <select name="special" id="cat-select" defaultValue={data.special}>
          <option value="">Ninguna</option>
          <option value="oferta">Oferta</option>
          <option value="novedad">Novedad</option>
        </select>
        <label htmlFor="image"><b>Imágen:</b></label>
        <input style={{ color: "whitesmoke" }} name="image" accept=".webp" type="file" />


        <fieldset>
          <label htmlFor="exclusive" style={{ marginRight: "1rem" }}><b>Solo Gianfranco:</b></label>
          <input name="exclusive" type="checkbox" defaultChecked={data.gianfrancoExclusive} />
        </fieldset>

        <fieldset>
          <legend style={{ color: "whitesmoke" }}>SubProducto</legend>
          <label htmlFor="sub-sku"><b>SKU:</b></label>
          <input name="sub-sku" type="text" defaultValue={data.subProduct?.sku} />

          <label htmlFor="sub-price"><b>Precio GF:</b></label>
          <input name="sub-price" type="number" step="0.01" min="0" max="999999"
            defaultValue={data.subProduct?.price.toString() || 0} />

          <label htmlFor="sub-price2"><b>Precio Distri:</b></label>
          <input name="sub-price2" type="number" step="0.01" min="0" max="999999"
            defaultValue={data.subProduct?.price2.toString() || 0} />
        </fieldset>
        <fieldset className="product-submit">
          <input className="button edit-button" value="Editar Producto" type="submit" />
          <button onClick={handleDeletion} className="button delete-button">
            Borrar Producto
          </button>
        </fieldset>
        <p className={state.error ? 'error-message' : 'success-message'}>
          {state.message}
        </p>
      </form>
    </div>
  );
};

export default ProductForm;

import Image from "next/image";
import Link from "next/link";
import NotFound from "@/app/not-found";
import ProductCreateForm from "@/app/_components/product-create-form";


export default async function Page() {

  return (
    <div>
      <h1>Crear Producto</h1>
      <ProductCreateForm />
      <button style={{ marginTop: "2%"}}><Link href="/admin/">Volver</Link></button>
    </div>
  );
}

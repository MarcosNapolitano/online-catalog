import NotFound from "@/app/not-found";
import { findSingleProduct, editProduct } from "@/app/_services/product_utils";
import ProductForm from "@/app/_components/product-form";
import { extname } from "path";
import Image from "next/image";


export default async function Page({ params, }: { params: Promise<{ sku: string }> }) {

  const sku = await params;
  const data = await findSingleProduct(sku.sku);
  if (!data) return <NotFound />;

  const prop: ProductForm = {
    sku: data.sku,
    name: data.name,
    url: data.url,
    extName: data.extName,
    units: data.units,
    price: data.price.toString(),
    price2: data.price2.toString(),
    section: data.section,
    orden: data.orden,
    special: data.special,
    gianfrancoExclusive: data.gianfrancoExclusive,
    sectionOrden: data.sectionOrden,
    sectionOrdenGianfranco: data.sectionOrdenGianfranco,
    isCombo: data.isCombo,
    imgUrls: data.imgUrls
  };

  if (data.subProduct) {
    const subProduct = {
      sku: data.subProduct.sku,
      price: data.subProduct.price.toString(),
      price2: data.subProduct.price2.toString(),
      extName: data.subProduct.extName
    };
    prop.subProduct = subProduct;
  }
  const URL = `${process.env.CDN_URL}/${process.env.CDN_HASH}/`;

  return (
     <ProductForm data={prop} urlPrefix={URL}/>
  );
}
